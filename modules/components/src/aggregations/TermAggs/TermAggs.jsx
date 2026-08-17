import cx from 'classnames';
import { isEmpty, merge, orderBy, partition, truncate } from 'lodash-es';
import { createRef, useState } from 'react';

import { TransparentButton } from '#Button/index';
import { removeSQON, toggleSQON } from '#SQONViewer/utils';
import TextFilter from '#TextFilter/index';
import TextHighlight from '#TextHighlight/index';
import { useThemeContext } from '#ThemeContext/index';
import ToggleButton from '#ToggleButton/index';
import formatNumber from '#utils/formatNumber';
import noopFn, { emptyObj, emptyStrFn } from '#utils/noops';
import strToReg from '#utils/strToReg';
import translateSQONValue from '#utils/translateSQONValue';

import AggsGroup from '../AggsGroup/index';
import BucketCount from '../BucketCount/index';

import styles from './TermAggs.module.css';

const generateNextSQON = ({ dotFieldName, bucket, isExclude, sqon }) =>
	toggleSQON(
		{
			op: 'and',
			content: [
				{
					op: isExclude ? 'not-in' : 'in',
					content: {
						fieldName: dotFieldName,
						value: [].concat(bucket.name || []),
					},
				},
			],
		},
		sqon,
	);

const IncludeExcludeButton = ({
	buckets,
	dotFieldName,
	handleIncludeExcludeChange,
	isActive,
	isExclude,
	ToggleButtonThemeProps,
	updateIsExclude,
}) => (
	<ToggleButton
		onChange={({
			value,
			isExclude = value === 'exclude',
		}) => {
			const activeBuckets = buckets.filter((b) => isActive({ fieldName: dotFieldName, value: b.name }));

			handleIncludeExcludeChange({
				isExclude,
				buckets: activeBuckets,
				generateNextSQON: (sqon) =>
					activeBuckets.reduce(
						(q, bucket) => generateNextSQON({ dotFieldName, isExclude, bucket, sqon: q }),
						removeSQON(dotFieldName, sqon),
					),
			});
			updateIsExclude(isExclude);
		}}
		options={[
			{ title: 'Include', value: 'include' },
			{ title: 'Exclude', value: 'exclude' },
		]}
		theme={ToggleButtonThemeProps}
		value={isExclude ? 'exclude' : 'include'}
	/>
);

const MoreOrLessButton = ({
	className = '',
	style: customCSS = {},
	howManyMore = 0,
	isShowingMore = false,
	...props
}) => (
	<TransparentButton
		className={cx(styles.showMoreWrapper, className)}
		data-showing-more={isShowingMore}
		style={customCSS || undefined}
		{...props}
	>
		{isShowingMore ? 'Less' : `${howManyMore} More`}
	</TransparentButton>
);

const decorateBuckets = ({ buckets, searchText }) => {
	const namedFilteredBuckets = buckets
		// TODO: displayValues may fit here
		.map((bucket) => ({
			...bucket,
			name: bucket.key_as_string ?? bucket.key,
		}))
		.filter((bucket) => !searchText || translateSQONValue(bucket.name).match(strToReg(searchText)));
	const [missing, notMissing] = partition(namedFilteredBuckets, {
		name: '__missing__',
	});
	return [...orderBy(notMissing, 'doc_count', 'desc'), ...missing];
};

// TODO: Improve exclusion filter ("not in"), allow mix
// TODO: temporarily quieting down TS errors to help migration
/**
 * @param {*} props
 */
const TermAggregations = ({
	aggHeaderRef = createRef(),
	aggWrapperRef = createRef(),
	buckets = [],
	constructBucketItemClassName = emptyStrFn,
	constructEntryId = ({ value }) => value,
	containerRef,
	Content = 'div',
	displayName = 'Unnamed Field',
	fieldName = '',
	handleIncludeExcludeChange = noopFn,
	handleValueClick = noopFn,
	headerTitle = null,
	highlightText,
	isActive = noopFn,
	isExclude: externalIsExclude = noopFn,
	// isExclude: externalIsExclude = noopFn<boolean>,
	maxTerms = 5,
	scrollToAgg = () => {
		if (containerRef?.current)
			containerRef.current.scrollTop =
				aggWrapperRef.current.offsetTop - aggHeaderRef.current.getBoundingClientRect().height;
	},
	searchPlaceholder = 'Search',
	showExcludeOption = false, // "exclude" selected fields (invert functionality)
	theme: {
		collapsing: {
			className: customCollapsingIconClassName,
			disabled: customCollapsingDisabled,
			onClick: customCollapsingIconHandler,
			...customCollapsingIconProps
		} = emptyObj,
		filtering: {
			className: customFilteringIconClassName,
			disabled: customFilteringDisabled,
			inputField: { Component: customFilteringInputFieldComponent, ...customFilteringInputFieldProps } = emptyObj,
			onClick: customFilteringIconHandler,
			...customFilteringIconProps
		} = emptyObj,
		sorting: {
			className: customSortingIconClassName,
			disabled: customSortingDisabled,
			onClick: customSortingIconHandler,
			...customSortingIconProps
		} = emptyObj,
	} = emptyObj,
	type,
	valueCharacterLimit,
	WrapperComponent,
} = emptyObj) => {
	const [isAlphabetized, setIsAlphabetized] = useState(false);
	const [isShowingMore, setShowingMore] = useState(false);
	const [stateIsExclude, setIsExclude] = useState(false);
	const [isShowingSearch, setShowingSearch] = useState(false);
	const [searchText, setSearchText] = useState('');
	const decoratedBuckets = decorateBuckets({ buckets, searchText });
	// this alphabetization could become expensive in fields with several values
	const alphabetizedBuckets = orderBy(decoratedBuckets, 'name');
	const dotFieldName = fieldName.replace(/__/g, '.');
	const isExclude = externalIsExclude({ fieldName: dotFieldName }) || stateIsExclude;
	const hasData = decoratedBuckets.length > 0;
	const hasSearchHit = highlightText && decoratedBuckets.some((x) => x.name.match(strToReg(searchText)));
	const showingMore = isShowingMore || hasSearchHit;
	const isMoreEnabled = decoratedBuckets.length > maxTerms;
	const dataFields = {
		...(fieldName && { 'data-fieldname': fieldName }),
		...(type && { 'data-type': type }),
	};

	// TODO: (THEME) refactor to separate internal components into their own files
	// that will allow chunking apart this gigantic destructuring pattern
	const {
		components: {
			Aggregations: {
				collapsing: {
					className: themeAggregationsCollapsingIconClassName,
					disabled: themeAggregationsCollapsingDisabled,
					onClick: themeAggregationsCollapsingIconHandler,
					...themeAggregationsCollapsingIconProps
				} = emptyObj,
				filtering: {
					className: themeAggregationsFilteringIconClassName,
					disabled: themeAggregationsFilteringDisabled,
					inputField: {
						Component: themeAggregationsFilteringInputField = TextFilter,
						...themeAggregationsFilteringInputFieldProps
					} = emptyObj,
					onClick: themeAggregationsFilteringIconHandler,
					...themeAggregationsFilteringIconProps
				} = emptyObj,
				MoreOrLessButton: themeAggregationsMoreOrLessButtonProps = emptyObj,
				NoDataContainer: {
					fontColor: themeNoDataFontColor,
					fontSize: themeNoDataFontSize,
				} = emptyObj,
				sorting: {
					className: themeAggregationsSortingIconClassName,
					descending: themeAggregationsSortingIconDescending,
					disabled: themeAggregationsSortingDisabled,
					Icon: themeAggregationsSortingIcon,
					onClick: themeAggregationsSortingIconHandler,
					size: themeAggregationsSortingIconSize,
					...themeAggregationsSortingIconProps
				} = emptyObj,
				TermAggregation: {
					BucketCount: { className: themeBucketCountClassName, ...bucketCountTheme } = emptyObj,
					collapsing: {
						className: themeTermAggregationsCollapsingIconClassName,
						disabled: themeTermAggregationsCollapsingDisabled,
						onClick: themeTermAggregationsCollapsingIconHandler,
						...themeTermAggregationsCollapsingIconProps
					} = emptyObj,
					filtering: {
						className: themeTermAggregationsFilteringIconClassName,
						disabled: themeTermAggregationsFilteringDisabled,
						inputField: {
							Component: themeTermAggregationsFilteringInputField = TextFilter,
							...themeTermAggregationsFilteringInputFieldProps
						} = emptyObj,
						onClick: themeTermAggregationsFilteringIconHandler,
						...themeTermAggregationsFilteringIconProps
					} = emptyObj,
					IncludeExcludeButton: ToggleButtonThemeProps = emptyObj,
					MoreOrLessButton: themeTermAggMoreOrLessButtonProps = emptyObj,
					sorting: {
						className: themeTermAggregationsSortingIconClassName,
						disabled: themeTermAggregationsSortingDisabled,
						onClick: themeTermAggregationsSortingIconHandler,
						...themeTermAggregationsSortingIconProps
					} = emptyObj,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'TermAgg' });

	const FilteringInputField = customFilteringInputFieldComponent || themeAggregationsFilteringInputField;
	const filteringInputFieldProps = {
		onChange: ({ value }) => setSearchText(value || ''),
		theme: {
			altText: 'Search data',
			placeholder: searchPlaceholder,
			...themeAggregationsFilteringInputFieldProps,
			...themeTermAggregationsFilteringInputFieldProps,
		},
		value: searchText,
	};

	const handleCollapsingIconClick = (event) => {
		customCollapsingIconHandler?.(event, fieldName);
		themeAggregationsCollapsingIconHandler?.(event, fieldName);
		themeTermAggregationsCollapsingIconHandler?.(event, fieldName);
	};

	// TODO: (THEME) allow sorting customizations
	const handleFilteringIconClick = (event) => {
		setShowingSearch(!isShowingSearch);
		customFilteringIconHandler?.(event, fieldName);
		themeAggregationsFilteringIconHandler?.(event, fieldName);
		themeTermAggregationsFilteringIconHandler?.(event, fieldName);
	};

	const handleSortingIconClick = (event) => {
		setIsAlphabetized(!isAlphabetized);
		customSortingIconHandler?.(event, fieldName);
		themeAggregationsSortingIconHandler?.(event, fieldName);
		themeTermAggregationsSortingIconHandler?.(event, fieldName);
	};

	/** @type {import('react').CSSProperties & Record<`--arranger-term-aggs-${string}`, string | undefined>} */
	const noDataThemeStyle = {
		'--arranger-term-aggs-no-data-font-color': themeNoDataFontColor,
		'--arranger-term-aggs-no-data-font-size': themeNoDataFontSize,
	};

	return (
		<AggsGroup
			componentRef={aggWrapperRef}
			dataFields={dataFields}
			headerRef={aggHeaderRef}
			filters={[
				isShowingSearch && (
					<>
						<FilteringInputField {...filteringInputFieldProps} />

						{showingMore && isMoreEnabled && (
							<MoreOrLessButton
								isShowingMore={true}
								onClick={() => {
									setShowingMore(false);
									scrollToAgg();
								}}
								{...themeAggregationsMoreOrLessButtonProps}
								{...themeTermAggMoreOrLessButtonProps}
							/>
						)}
					</>
				),
				showExcludeOption && !isEmpty(decoratedBuckets) && (
					<IncludeExcludeButton
						{...{
							buckets: decoratedBuckets,
							dotFieldName,
							handleIncludeExcludeChange,
							isActive,
							isExclude,
							ToggleButtonThemeProps,
							updateIsExclude: setIsExclude,
						}}
					/>
				),
			].filter((filter) => !!filter)}
			stickyHeader
			theme={{
				collapsing: {
					className: cx(
						customCollapsingIconClassName,
						themeTermAggregationsCollapsingIconClassName,
						themeAggregationsCollapsingIconClassName,
					),
					disabled:
						customCollapsingDisabled ||
						themeTermAggregationsCollapsingDisabled ||
						themeAggregationsCollapsingDisabled,
					onClick: handleCollapsingIconClick,
					...themeAggregationsCollapsingIconProps,
					...themeTermAggregationsCollapsingIconProps,
					...customCollapsingIconProps,
				},
				displayName,
				filtering: {
					className: cx(
						isShowingSearch && 'active',
						customFilteringIconClassName,
						themeTermAggregationsFilteringIconClassName,
						themeAggregationsFilteringIconClassName,
					),
					disabled:
						customFilteringDisabled ||
						themeTermAggregationsFilteringDisabled ||
						themeAggregationsFilteringDisabled ||
						!hasData,
					onClick: handleFilteringIconClick,
					...themeAggregationsFilteringIconProps,
					...themeTermAggregationsFilteringIconProps,
					...customFilteringIconProps,
				},
				sorting: hasData && {
					className: cx(
						isAlphabetized && 'active',
						customSortingIconClassName,
						themeTermAggregationsSortingIconClassName,
						themeAggregationsSortingIconClassName,
					),
					disabled:
						customSortingDisabled ||
						themeTermAggregationsSortingDisabled ||
						themeAggregationsSortingDisabled ||
						!hasData,
					onClick: handleSortingIconClick,
					...themeAggregationsSortingIconProps,
					...themeTermAggregationsSortingIconProps,
					...customSortingIconProps,
				},
				WrapperComponent,
			}}
		>
			{headerTitle && <div className={styles.header}>{headerTitle}</div>}

			{hasData ? (
				<div className={styles.bucketList}>
					{(isAlphabetized ? alphabetizedBuckets : decoratedBuckets)
						.slice(0, showingMore ? Infinity : maxTerms)
						.map((bucket, i, array) => (
							<Content
								id={constructEntryId({
									value: `${fieldName}--${bucket.name.replace(/\s/g, '-')}`,
								})}
								key={bucket.name}
								className={cx(
									styles.bucketItem,
									constructBucketItemClassName({
										bucket,
										i,
										showingBuckets: array,
										showingMore,
									}),
								)}
								content={{
									fieldName: dotFieldName,
									value: bucket.name,
								}}
								onClick={() =>
									handleValueClick({
										fieldName: dotFieldName,
										value: bucket,
										isExclude,
										generateNextSQON: (sqon) =>
											generateNextSQON({ isExclude, dotFieldName, bucket, sqon }),
									})
								}
							>
								<span
									className={styles.bucketLink}
									merge="toggle"
								>
									<input
										aria-label={`Select ${bucket.name}`}
										checked={isActive({
											fieldName: dotFieldName,
											value: bucket.name,
										})}
										className={styles.checkbox}
										id={`input-${fieldName}-${bucket.name.replace(/\s/g, '-')}`}
										name={`input-${fieldName}-${bucket.name.replace(/\s/g, '-')}`}
										readOnly
										type="checkbox"
									/>

									<TextHighlight
										content={
											truncate(translateSQONValue(bucket.name), {
												length: valueCharacterLimit || Infinity,
											}) + ' '
										}
										highlightText={searchText}
									/>
								</span>

								{bucket.doc_count && (
									<BucketCount
										className={cx(styles.bucketCount, themeBucketCountClassName)}
										theme={bucketCountTheme}
									>
										{formatNumber(bucket.doc_count)}
									</BucketCount>
								)}
							</Content>
						))}
				</div>
			) : (
				<span
					className={styles.noData}
					style={noDataThemeStyle}
				>
					No data available
				</span>
			)}

			{isMoreEnabled && (
				<MoreOrLessButton
					howManyMore={decoratedBuckets.length - maxTerms}
					isShowingMore={showingMore}
					onClick={() => {
						setShowingMore(!showingMore);
						if (showingMore) scrollToAgg();
					}}
					theme={merge({}, themeAggregationsMoreOrLessButtonProps, themeTermAggMoreOrLessButtonProps)}
				/>
			)}
		</AggsGroup>
	);
};

export default TermAggregations;
