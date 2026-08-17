import cx from 'classnames';
import convert from 'convert-units';
import { debounce, isEqual, isNil } from 'lodash-es';
import { Component } from 'react';
import InputRange from 'react-input-range'; // TODO: abandoned. use rc-slider instead
import 'react-input-range/lib/css/index.css';

import { replaceFieldSQON } from '#SQONViewer/utils';
import { withTheme } from '#ThemeContext/index';
import formatNumber from '#utils/formatNumber';
import { emptyObj } from '#utils/noops';

import AggsGroup from './AggsGroup/index';
import styles from './RangeAgg.module.css';

const SUPPORTED_CONVERSIONS = {
	time: ['d', 'year'],
	digital: ['GB'],
};

const supportedConversionFromUnit = (unit) => (unit ? SUPPORTED_CONVERSIONS[convert().describe(unit).measure] : []);

const RangeLabel = ({
	background,
	children,
	className,
	borderRadius,
	style: customCSS,
	fontWeight,
	isRight,
	isTop,
	margin,
	padding,
	...props
}) => {
	const themeStyle = {
		'--arranger-range-label-background': background,
		'--arranger-range-label-border-radius': borderRadius,
		'--arranger-range-label-font-weight': fontWeight,
		'--arranger-range-label-margin': margin,
		'--arranger-range-label-padding': padding,
	};

	return (
		<div
			className={cx(styles.rangeLabel, className)}
			data-right={Boolean(isRight)}
			data-top={Boolean(isTop)}
			style={{ ...themeStyle, ...customCSS }}
			{...props}
		>
			{children}
		</div>
	);
};

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

class RangeAgg extends Component {
	constructor(props) {
		super(props);
		const { sqonValues, stats: { max = 0, min = 0 } = emptyObj, unit } = props;

		const supportedConversions = supportedConversionFromUnit(unit);

		this.state = {
			currentValues: {
				max: sqonValues?.max || max,
				min: sqonValues?.min || min,
			},
			displayUnit: supportedConversions?.includes(unit)
				? unit // use unit selected in Admin UI as default, if available here
				: supportedConversions?.[0],
			supportedConversions,
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { sqonValues: { max: sqonMax, min: sqonMin } = emptyObj, stats: { max: newMax, min: newMin } = emptyObj } =
			nextProps;
		const { stats: { max: oldMax, min: oldMin } = emptyObj } = this.props;
		const { currentValues: { max: selectedMax, min: selectedMin } = emptyObj } = this.state;

		const resetMax = isNil(sqonMax)
			? isNil(oldMax) || (newMax > oldMax && oldMax === selectedMax) || newMax !== selectedMax
			: newMax < selectedMax || newMin > selectedMax;
		const resetMin = isNil(sqonMin)
			? isNil(oldMin) || (newMin < oldMin && oldMin === selectedMin) || newMin !== selectedMin
			: newMin > selectedMin || newMax < selectedMin;

		const newState = {
			currentValues: {
				max: resetMax ? newMax : Math.min(sqonMax || selectedMax, newMax),
				min: resetMin ? newMin : Math.max(sqonMin || selectedMin, newMin),
			},
		};

		isEqual(this.state.currentValues, newState.currentValues) || this.setState(newState);
	}

	onChangeComplete = debounce(() => {
		const {
			displayName,
			fieldName,
			handleChange,
			stats: { max, min },
		} = this.props;
		let { currentValues, displayUnit } = this.state;

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
	}, 300);

	setNewUnit = (event) => this.setState({ displayUnit: event.target.value });

	setNewValue = ({ max: newMax, min: newMin }) => {
		const {
			stats: { max, min },
		} = this.props;

		console.log('min', min);
		console.log('newMin', newMin);

		// if (!(newMax === max && newMin === min)) {
		this.setState({
			currentValues: {
				max: newMax <= max ? newMax : max,
				min: newMin >= min ? newMin : min,
			},
		});
		// }
	};

	formatRangeLabel = (value, type) => {
		const { formatLabel, unit } = this.props;
		const { displayUnit } = this.state;

		return (
			formatLabel?.(value, type) ||
			formatNumber(unit && displayUnit && unit !== displayUnit ? convert(value).from(unit).to(displayUnit) : value)
		);
	};

	render() {
		const {
			disabled,
			displayName = 'Unnamed Field',
			fieldName,
			rangeStep: rangeStepFromProps,
			stats: { max, min } = emptyObj,
			theme: {
				colors,
				components: {
					Aggregations: {
						RangeAgg: {
							// disableUnitSelection: themeDisableUnitSelection,
							InputRange: { style: themeInputRangeCSS } = emptyObj,
							NoDataContainer: {
								fontColor: themeNoDataFontColor,
								fontSize: themeNoDataFontSize,
							} = emptyObj,
							RangeLabel: themeRangeLabelProps = emptyObj,
							RangeSlider: {
								background: themeRangeSliderBackground = colors?.common?.white,
								borderColor: themeRangeSliderBorderColor = colors?.grey?.[500],
								style: themeRangeSliderCSS,
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
							RangeWrapper: { style: themeRangeWrapperCSS, ...RangeWrapperProps } = emptyObj,
							...themeRangeAggProps
						} = emptyObj,
					} = emptyObj,
				} = emptyObj,
			} = emptyObj,
			type,
			WrapperComponent,
		} = this.props;
		const { currentValues, displayUnit, supportedConversions } = this.state;

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

		/** @type {import('react').CSSProperties & Record<`--arranger-range-agg-${string}`, string | undefined>} */
		const noDataThemeStyle = {
			'--arranger-range-agg-no-data-font-color': themeNoDataFontColor,
			'--arranger-range-agg-no-data-font-size': themeNoDataFontSize,
		};

		return (
			<AggsGroup
				dataFields={dataFields}
				theme={{
					displayName: `${displayName}${displayUnit ? ` (${convert().describe(displayUnit).plural})` : ``}`,
					filtering: false,
					sorting: false,
					WrapperComponent,
					...themeRangeAggProps
				}}
			>
				{hasData ? (
					<div
						className={styles.rangeWrapper}
						style={themeRangeWrapperCSS}
						{...RangeWrapperProps}
					>
						{supportedConversions.length > 1 && (
							<div className={styles.unitWrapper}>
								{supportedConversions
									.map((x) => convert().describe(x))
									.map((x) => ({ ...x, isActive: x.abbr === displayUnit }))
									.map(({ abbr, plural, isActive }) => (
										<label
											className={styles.unitLabel}
											htmlFor={abbr}
											key={abbr}
										>
											<input checked={isActive} id={abbr} onChange={this.setNewUnit} type="radio" value={abbr} />
											{plural}
										</label>
									))}
							</div>
						)}

						<div
							className={styles.inputRangeWrapper}
							data-disabled={unusable}
						>
							<RangeLabel isTop {...themeRangeLabelProps}>
								{this.formatRangeLabel(currentValues.min)}
							</RangeLabel>

							{!minIsMax && (
								<RangeLabel isTop isRight {...themeRangeLabelProps}>
									{this.formatRangeLabel(currentValues.max)}
								</RangeLabel>
							)}

							<InputRange
								allowSameValues={true}
								ariaLabelledby={getLabelId(displayName)}
								className={cx({ disabled: unusable })}
								disabled={unusable}
								draggableTrack
								formatLabel={this.formatRangeLabel}
								minValue={min}
								maxValue={max}
								onChange={this.setNewValue}
								onChangeComplete={this.onChangeComplete}
								step={rangeStep}
								value={currentValues}
							/>

							<RangeLabel {...themeRangeLabelProps}>{this.formatRangeLabel(min)}</RangeLabel>

							{!minIsMax && (
								<RangeLabel isRight {...themeRangeLabelProps}>
									{this.formatRangeLabel(max)}
								</RangeLabel>
							)}

							<span
								className={styles.hiddenLabel}
								id={getLabelId(displayName)}
							>
								{`Set ${displayName}`}
							</span>
						</div>
					</div>
				) : (
					<span
						className={styles.noData}
						style={noDataThemeStyle}
					>
						No data available
					</span>
				)}
			</AggsGroup>
		);
	}
}

export default withTheme(RangeAgg);
