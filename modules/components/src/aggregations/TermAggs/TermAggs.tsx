import type { ComponentType } from 'react';

import cx from 'classnames';
import { isEmpty, merge, orderBy, partition, truncate } from 'lodash-es';
import { createRef, useState } from 'react';

import { TransparentButton } from '#Button/index.js';
import { removeSQON, toggleSQON } from '#SQONViewer/utils.js';
import TextFilter from '#TextFilter/index.js';
import TextHighlight from '#TextHighlight/index.js';
import ToggleButton from '#ToggleButton/index.js';
import formatNumber from '#utils/formatNumber.js';
import noopFn, { emptyObj, emptyStrFn } from '#utils/noops.js';
import strToReg from '#utils/strToReg.js';
import translateSQONValue from '#utils/translateSQONValue.js';

import AggsGroup from '../AggsGroup/index.js';
import BucketCount from '../BucketCount/index.js';
import styles from './TermAggs.module.css';

const generateNextSQON = ({ dotFieldName, bucket, isExclude, sqon }: any) =>
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

interface IncludeExcludeButtonProps {
	buckets: any[];
	dotFieldName: string;
	handleIncludeExcludeChange: any;
	isActive: any;
	isExclude: boolean;
	ToggleButtonThemeProps: any;
	updateIsExclude: any;
}

const IncludeExcludeButton = ({
	buckets,
	dotFieldName,
	handleIncludeExcludeChange,
	isActive,
	isExclude,
	ToggleButtonThemeProps,
	updateIsExclude,
}: IncludeExcludeButtonProps) => (
	<ToggleButton
		onChange={({ value, isExclude = value === 'exclude' }) => {
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

interface MoreOrLessButtonProps {
	howManyMore?: number;
	isShowingMore?: boolean;
}

const MoreOrLessButton = ({
	className = '',
	css: customCSS = '',
	howManyMore = 0,
	isShowingMore = false,
	...props
}: MoreOrLessButtonProps) => (
	<TransparentButton
		className={cx(styles.showMoreWrapper, 'showMore-wrapper', isShowingMore ? 'less' : 'more', className)}
		css={customCSS}
		{...props}
	>
		{isShowingMore ? 'Less' : `${howManyMore} More`}
	</TransparentButton>
);

const decorateBuckets = ({ buckets, searchText }: any) => {
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

interface TermAggregationsProps {
	aggHeaderRef?: any;
	aggWrapperRef?: any;
	buckets?: any[];
	constructBucketItemClassName?: any;
	constructEntryId?: any;
	containerRef?: any;
	Content?: ComponentType<any>;
	displayName?: string;
	fieldName?: string;
	handleIncludeExcludeChange?: any;
	handleValueClick?: any;
	headerTitle?: any;
	highlightText?: string;
	isActive?: any;
	isExclude?: any;
	maxTerms?: number;
	scrollToAgg?: any;
	searchPlaceholder?: string;
	showExcludeOption?: boolean;
	type?: string;
	valueCharacterLimit?: number;
	WrapperComponent?: ComponentType<any>;
}

const TermAggregations = ({
	aggHeaderRef = createRef(),
	aggWrapperRef = createRef(),
	buckets = [],
	constructBucketItemClassName = emptyStrFn,
	constructEntryId = ({ value }) => value,
	containerRef,
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
	type,
	valueCharacterLimit,
	WrapperComponent,
}: TermAggregationsProps) => {
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

	const filteringInputFieldProps = {
		onChange: ({ value }) => setSearchText(value || ''),
		theme: {
			altText: 'Search data',
			placeholder: searchPlaceholder,
		},
		value: searchText,
	};

	const handleFilterClick = () => {
		setShowingSearch(!isShowingSearch);
	};

	const handleSortClick = () => {
		setIsAlphabetized(!isAlphabetized);
	};
	return (
		<AggsGroup
			displayName={displayName}
			collapsible={true}
			filterable={hasData}
			sortable={hasData}
			isFiltered={isShowingSearch}
			isSorted={isAlphabetized}
			onFilterClick={handleFilterClick}
			onSortClick={handleSortClick}
			WrapperComponent={WrapperComponent}
			componentRef={aggWrapperRef}
			dataFields={dataFields}
			headerRef={aggHeaderRef}
			filters={[
				isShowingSearch && (
					<>
						<TextFilter {...filteringInputFieldProps} />

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
		>
			{headerTitle && <div className={cx(styles.header, 'header')}>{headerTitle}</div>}

			{hasData ? (
				<div className={styles.container}>
					{(isAlphabetized ? alphabetizedBuckets : decoratedBuckets)
						.slice(0, showingMore ? Infinity : maxTerms)
						.map((bucket, i, array) => (
							<div
								id={constructEntryId({
									value: `${fieldName}--${bucket.name.replace(/\s/g, '-')}`,
								})}
								key={bucket.name}
								className={cx(
									styles.bucketItem,
									'bucket-item',
									constructBucketItemClassName({
										bucket,
										i,
										showingBuckets: array,
										showingMore,
									}),
								)}
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
								<span className={cx(styles.bucketLink, 'bucket-link')}>
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
										className={themeBucketCountClassName}
										theme={bucketCountTheme}
									>
										{formatNumber(bucket.doc_count)}
									</BucketCount>
								)}
							</div>
						))}
				</div>
			) : (
				<span className={cx(styles.noData, 'no-data')}>No data available</span>
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
