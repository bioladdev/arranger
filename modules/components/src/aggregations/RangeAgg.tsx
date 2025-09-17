import { css } from '@emotion/react';
import cx from 'classnames';
import convert from 'convert-units';
import { debounce, isEqual, isNil } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { replaceFieldSQON } from '#SQONViewer/utils.js';
import { useThemeContext } from '#ThemeContext/index.js';
import formatNumber from '#utils/formatNumber.js';
import { emptyObj } from '#utils/noops.js';

import AggsWrapper from './AggsWrapper.js';

const SUPPORTED_CONVERSIONS = {
	time: ['d', 'year'],
	digital: ['GB'],
};

const supportedConversionFromUnit = (unit) => (unit ? SUPPORTED_CONVERSIONS[convert().describe(unit).measure] : []);

const RangeLabel = ({
	background = 'none',
	children,
	className,
	borderRadius = 0,
	css: customCSS,
	fontWeight = 'inherit',
	isRight,
	isTop,
	margin,
	padding,
	...props
}) => (
	<div
		className={cx('RangeLabel', { bottom: !isTop, left: !isRight, right: isRight, top: isTop }, className)}
		css={[
			css`
				background: ${background};
				border-radius: ${borderRadius};
				color: ${isTop ? 'inherit' : '#666'};
				font-size: ${isTop ? 0.9 : 0.7}rem;
				font-weight: ${fontWeight};
				margin: ${margin};
				padding: ${padding};
				position: absolute;
				${isRight && `right: 0;`}
				top: ${isTop ? `-` : ``}1.2rem;
			`,
			customCSS,
		]}
		{...props}
	>
		{children}
	</div>
);

const getLabelId = (displayName) => {
	return `${displayName.split('(')[0].trim().toLowerCase().replace(/\s/g, '-')}__range-label`;
};

const calculateRangeStep = (min, max) => {
	const fractionRemainderFromMax = Number(formatNumber(max)) % 1;
	const fractionRemainderFromMin = Number(formatNumber(min)) % 1;
	const decimalPointsFromMax = fractionRemainderFromMax
		? `${fractionRemainderFromMax}`.replace('0.', '').length - 1
		: 0;
	const decimalPointsFromMin = fractionRemainderFromMin
		? `${fractionRemainderFromMin}`.replace('0.', '').length - 1
		: 0;

	return Math.max(decimalPointsFromMax, decimalPointsFromMin);
};

interface RangeAggProps {
	sqonValues?: { max?: number; min?: number };
	stats?: { max?: number; min?: number };
	unit?: string;
	displayName?: string;
	fieldName: string;
	handleChange?: (args: any) => void;
	formatLabel?: (value: number, type: string) => string;
	collapsible?: boolean;
	disabled?: boolean;
	rangeStep?: number;
	type?: string;
	WrapperComponent?: React.ComponentType<any>;
}

const RangeAgg = ({
	sqonValues,
	stats: { max = 0, min = 0 } = emptyObj,
	unit,
	displayName = 'Unnamed Field',
	fieldName,
	handleChange,
	formatLabel,
	collapsible = true,
	disabled,
	rangeStep: rangeStepFromProps,
	type,
	WrapperComponent,
}: RangeAggProps) => {
	const theme = useThemeContext();
	const prevPropsRef = useRef({ sqonValues, stats: { max, min } });

	const supportedConversions = useMemo(() => supportedConversionFromUnit(unit), [unit]);

	const [currentValues, setCurrentValues] = useState({
		max: sqonValues?.max || max,
		min: sqonValues?.min || min,
	});

	const [displayUnit, setDisplayUnit] = useState(
		supportedConversions?.includes(unit)
			? unit // use unit selected in Admin UI as default, if available here
			: supportedConversions?.[0],
	);

	useEffect(() => {
		const prevProps = prevPropsRef.current;
		const { max: sqonMax, min: sqonMin } = sqonValues || emptyObj;
		const { max: newMax, min: newMin } = { max, min };
		const { max: oldMax, min: oldMin } = prevProps.stats;
		const { max: selectedMax, min: selectedMin } = currentValues;

		const resetMax = isNil(sqonMax)
			? isNil(oldMax) || (newMax > oldMax && oldMax === selectedMax) || newMax !== selectedMax
			: newMax < selectedMax || newMin > selectedMax;
		const resetMin = isNil(sqonMin)
			? isNil(oldMin) || (newMin < oldMin && oldMin === selectedMin) || newMin !== selectedMin
			: newMin > selectedMin || newMax < selectedMin;

		const newValues = {
			max: resetMax ? newMax : Math.min(sqonMax || selectedMax, newMax),
			min: resetMin ? newMin : Math.max(sqonMin || selectedMin, newMin),
		};

		if (!isEqual(currentValues, newValues)) {
			setCurrentValues(newValues);
		}

		prevPropsRef.current = { sqonValues, stats: { max, min } };
	}, [sqonValues, max, min, currentValues]);

	const onChangeComplete = useMemo(
		() =>
			debounce(() => {
				return handleChange?.({
					field: {
						displayName,
						displayUnit,
						fieldName,
					},
					generateNextSQON: (sqon) =>
						replaceFieldSQON(
							fieldName,
							{
								op: 'and',
								content: [
									...(currentValues.min > min ? [{ op: '>=', content: { fieldName, value: currentValues.min } }] : []),
									...(currentValues.max < max ? [{ op: '<=', content: { fieldName, value: currentValues.max } }] : []),
								],
							},
							sqon,
						),
					max: currentValues.max,
					min: currentValues.min,
					value: currentValues,
				});
			}, 300),
		[displayName, displayUnit, fieldName, handleChange, currentValues, min, max],
	);

	const setNewUnit = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setDisplayUnit(event.target.value);
	}, []);

	const setNewValue = useCallback(
		({ max: newMax, min: newMin }: { max: number; min: number }) => {
			console.log('min', min);
			console.log('newMin', newMin);

			setCurrentValues({
				max: newMax <= max ? newMax : max,
				min: newMin >= min ? newMin : min,
			});
		},
		[max, min],
	);

	const formatRangeLabel = useCallback(
		(value: number, type?: string) => {
			return (
				formatLabel?.(value, type) ||
				formatNumber(unit && displayUnit && unit !== displayUnit ? convert(value).from(unit).to(displayUnit) : value)
			);
		},
		[formatLabel, unit, displayUnit],
	);

	const {
		colors,
		components: {
			Aggregations: {
				RangeAgg: {
					// disableUnitSelection: themeDisableUnitSelection,
					InputRange: { css: themeInputRangeCSS } = emptyObj,
					NoDataContainer: {
						fontColor: themeNoDataFontColor = colors?.grey?.[600],
						fontSize: themeNoDataFontSize = '0.8em',
					} = emptyObj,
					RangeLabel: themeRangeLabelProps = emptyObj,
					RangeSlider: {
						background: themeRangeSliderBackground = colors?.common?.white,
						borderColor: themeRangeSliderBorderColor = colors?.grey?.[500],
						css: themeRangeSliderCSS,
						disabledBackground: themeRangeSliderDisabledBackground = colors?.grey?.[200],
						disabledBorderColor: themeRangeSliderDisabledBorderColor = colors?.grey?.[500],
					} = emptyObj,
					RangeTrack: {
						background: themeRangeTrackBackground = 'none',
						disabledBackground: themeRangeTrackDisabledBackground = colors?.grey?.[200],
						disabledInBackground: themeRangeTrackDisabledInBackground = colors?.grey?.[400],
						disabledOutBackground: themeRangeTrackDisabledOutBackground = colors?.grey?.[200],
						inBackground: themeRangeTrackInBackground = colors?.grey?.[600],
						outBackground: themeRangeTrackOutBackground = colors?.grey?.[200],
					} = emptyObj,
					RangeWrapper: { css: themeRangeWrapperCSS, ...RangeWrapperProps } = emptyObj,
					...themeRangeAggProps
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = theme;

	const hasData = [!isNil(min), !isNil(max)].every(Boolean);

	const dataFields = {
		'data-available': hasData,
		...(fieldName && { 'data-fieldname': fieldName }),
		...(type && { 'data-type': type }),
	};

	const decimals = calculateRangeStep(min, max);
	const calculatedStep = decimals ? parseFloat(`0.${String(1).padStart(decimals, '0')}`) : 1;

	const rangeStep = rangeStepFromProps || calculatedStep;
	// console.log('rangeStep', rangeStep);

	const minIsMax = min === max;
	const unusable = disabled || min + rangeStep === max || minIsMax;

	// TODO: implement unit selection disabling per fieldname.
	// const enableUnitSelection = !themeDisableUnitSelection;

	return (
		<AggsWrapper
			dataFields={dataFields}
			displayName={`${displayName}${displayUnit ? ` (${convert().describe(displayUnit).plural})` : ``}`}
			{...{ WrapperComponent, collapsible }}
			theme={themeRangeAggProps}
		>
				{hasData ? (
					<div
						className="range-wrapper"
						css={[
							themeRangeWrapperCSS,
							css`
								align-items: center;
								display: flex;
								flex-direction: column;
								width: 100%;
							`,
						]}
						{...RangeWrapperProps}
					>
						{supportedConversions.length > 1 && (
							<div
								className="unit-wrapper"
								css={css`
									text-align: center;
									margin-top: 4px;
								`}
							>
								{supportedConversions
									.map((x) => convert().describe(x))
									.map((x) => ({ ...x, isActive: x.abbr === displayUnit }))
									.map(({ abbr, plural, isActive }) => (
										<label
											css={css`
												margin: 0 5px;
												font-family: inherit;
												color: inherit;
												border-bottom: none;
											`}
											htmlFor={abbr}
											key={abbr}
										>
											<input checked={isActive} id={abbr} onChange={setNewUnit} type="radio" value={abbr} />
											{plural}
										</label>
									))}
							</div>
						)}

						<div
							className={cx('input-range-wrapper', { disabled: unusable })}
							css={css`
								margin: 1.5rem 0;
								position: relative;
								font-size: 0.8rem;
								width: 90%;

								/** rc-slider styling customization */
								.rc-slider {
									.rc-slider-rail {
										background: ${unusable ? themeRangeTrackDisabledOutBackground : themeRangeTrackOutBackground};
									}

									.rc-slider-track {
										background: ${unusable ? themeRangeTrackDisabledInBackground : themeRangeTrackInBackground};
									}

									.rc-slider-handle {
										background: ${unusable ? themeRangeSliderDisabledBackground : themeRangeSliderBackground};
										border-color: ${unusable ? themeRangeSliderDisabledBorderColor : themeRangeSliderBorderColor};

										${themeRangeSliderCSS}
									}

									&.rc-slider-disabled {
										.rc-slider-handle,
										.rc-slider-track,
										.rc-slider-rail {
											cursor: default;
										}
									}

									${themeInputRangeCSS}
								}
							`}
						>
							<RangeLabel isTop {...themeRangeLabelProps}>
								{formatRangeLabel(currentValues.min)}
							</RangeLabel>

							{!minIsMax && (
								<RangeLabel isTop isRight {...themeRangeLabelProps}>
									{formatRangeLabel(currentValues.max)}
								</RangeLabel>
							)}

							<Slider
								range
								allowCross={false}
								ariaLabelledbyForHandle={getLabelId(displayName)}
								className={cx({ disabled: unusable })}
								disabled={unusable}
								min={min}
								max={max}
								onChange={(values) => {
									if (Array.isArray(values) && values.length === 2) {
										setNewValue({ min: values[0], max: values[1] });
									}
								}}
								onChangeComplete={(values) => {
									if (Array.isArray(values) && values.length === 2) {
										setNewValue({ min: values[0], max: values[1] });
										onChangeComplete();
									}
								}}
								step={rangeStep}
								value={[currentValues.min, currentValues.max]}
							/>

							<RangeLabel {...themeRangeLabelProps}>{formatRangeLabel(min)}</RangeLabel>

							{!minIsMax && (
								<RangeLabel isRight {...themeRangeLabelProps}>
									{formatRangeLabel(max)}
								</RangeLabel>
							)}

							<span
								id={getLabelId(displayName)}
								css={css`
									position: absolute;
									height: 0;
									width: 0;
									top: -9999px;
									left: -9999px;
								`}
							>
								{`Set ${displayName}`}
							</span>
						</div>
					</div>
				) : (
					<span
						className="no-data"
						css={css`
							color: ${themeNoDataFontColor};
							display: block;
							font-size: ${themeNoDataFontSize};
						`}
					>
						No data available
					</span>
				)}
			</AggsWrapper>
		);
};

export default RangeAgg;
