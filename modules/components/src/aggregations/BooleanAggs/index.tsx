import cx from 'classnames';

import { AggsGroup, BucketCount } from '#aggregations/index';
import { replaceSQON, removeSQON } from '#SQONViewer/utils';
import TextHighlight from '#TextHighlight/index';
import { useThemeContext } from '#ThemeContext/index';
import ToggleButton from '#ToggleButton/index';
import formatNumber from '#utils/formatNumber';
import noopFn, { emptyObj } from '#utils/noops';

import { defaultDisplayLabels, defaultValueKeys } from './constants';
import styles from './styles.module.css';
import type Props from './types';

const emptyBucket = {
	doc_count: 0,
};

const BooleanAggs = ({
	buckets = [],
	defaultDisplayKeys = defaultDisplayLabels,
	displayKeys: customDisplayKeys,
	displayName,
	displayValues: extendedDisplayKeys = emptyObj,
	fieldName,
	handleValueClick = noopFn,
	highlightText,
	isActive = noopFn,
	type,
	valueKeys = defaultValueKeys,
	WrapperComponent,
}: Props) => {
	const {
		components: {
			Aggregations: {
				BooleanAggs: {
					BucketCount: { className: themeBucketCountClassName, ...bucketCountTheme } = emptyObj,
					ToggleButton: { className: themeToggleButtonClassName } = emptyObj,
				} = emptyObj,
				NoDataContainer: {
					fontColor: themeNoDataFontColor,
					fontSize: themeNoDataFontSize,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'BooleanAggs' });

	const displayKeys =
		customDisplayKeys ??
		Object.keys(defaultDisplayKeys).reduce(
			(obj, displayKey) => ({
				...obj,
				[displayKey]: extendedDisplayKeys[displayKey] || defaultDisplayKeys[displayKey],
			}),
			{},
		);

	const trueBucket = buckets.find(({ key_as_string }) => key_as_string === valueKeys.true) || emptyBucket;
	const falseBucket = buckets.find(({ key_as_string }) => key_as_string === valueKeys.false) || emptyBucket;

	const missingKeyBucket = buckets.find(({ key_as_string }) => !key_as_string);

	const dotFieldName = fieldName.replace(/__/g, '.');

	const isTrueActive = isActive({
		value: valueKeys.true,
		fieldName: dotFieldName,
	});
	const isFalseActive = isActive({
		value: valueKeys.false,
		fieldName: dotFieldName,
	});

	const isTrueBucketDisabled = trueBucket === undefined || trueBucket?.doc_count <= 0;
	const isFalseBucketDisabled = falseBucket === undefined || falseBucket?.doc_count <= 0;

	const handleChange = (isTrue, fieldName) => {
		handleValueClick(
			isTrue === undefined // aka "Any" button clicked
				? {
						fieldName,
						generateNextSQON: (sqon) => removeSQON(dotFieldName, sqon),
						value: 'Any',
					}
				: {
						bucket: isTrue ? trueBucket : falseBucket,
						fieldName,
						generateNextSQON: (sqon) =>
							replaceSQON(
								{
									op: 'and',
									content: [
										{
											op: 'in',
											content: {
												fieldName: dotFieldName,
												value: [valueKeys[isTrue ? 'true' : 'false']],
											},
										},
									],
								},
								sqon,
							),
						value: isTrue ? trueBucket : falseBucket || missingKeyBucket,
					},
		);
	};

	const hasData = trueBucket?.doc_count > 0;

	/**
	 *
	 */
	const options = (
		'any' in displayKeys
			? [
					{
						title: displayKeys.any,
						value: undefined,
					},
				]
			: []
	).concat([
		{
			value: valueKeys.true,
			disabled: isTrueBucketDisabled,
			title: ({ toggleStatus = '' } = emptyObj) => (
				<>
					<TextHighlight
						content={displayKeys.true}
						highlightText={highlightText}
					/>
					<BucketCount
						className={cx(toggleStatus, styles.trueBucketCount, themeBucketCountClassName)}
						theme={bucketCountTheme}
					>
						{formatNumber(isTrueBucketDisabled ? 0 : trueBucket.doc_count)}
					</BucketCount>
				</>
			),
		},
		{
			value: valueKeys.false,
			disabled: isFalseBucketDisabled,
			title: ({ toggleStatus = '' } = emptyObj) => (
				<>
					<TextHighlight
						content={displayKeys.false}
						highlightText={highlightText}
					/>
					<BucketCount
						className={cx(toggleStatus, styles.falseBucketCount, themeBucketCountClassName)}
						theme={bucketCountTheme}
					>
						{formatNumber(isFalseBucketDisabled ? 0 : falseBucket.doc_count)}
					</BucketCount>
				</>
			),
		},
	]);

	const dataFields = {
		...(fieldName && { 'data-fieldname': fieldName }),
		...(type && { 'data-type': type }),
	};

	return (
		<AggsGroup
			dataFields={dataFields}
			theme={{
				displayName,
				filtering: false,
				sorting: false,
				WrapperComponent,
			}}
		>
			{hasData ? (
				<div className={styles.optionsWrapper}>
					<ToggleButton
						className={themeToggleButtonClassName}
						onChange={({ value }) => {
							handleChange(
								value === valueKeys.true ? true : value === valueKeys.false ? false : undefined,
								dotFieldName,
							);
						}}
						options={options}
						value={isTrueActive ? valueKeys.true : isFalseActive ? valueKeys.false : undefined}
					/>
				</div>
			) : (
				<span
					className={styles.noData}
					style={{
						'--arranger-boolean-aggs-no-data-font-color': themeNoDataFontColor,
						'--arranger-boolean-aggs-no-data-font-size': themeNoDataFontSize,
					}}
				>
					No data available
				</span>
			)}
		</AggsGroup>
	);
};

export default BooleanAggs;
