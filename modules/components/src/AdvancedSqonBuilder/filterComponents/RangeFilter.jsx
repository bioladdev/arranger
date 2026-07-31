import convert from 'convert-units';
import { min, max } from 'lodash-es';
import { useState } from 'react';

import {
	getOperationAtPath,
	setSqonAtPath,
	FIELD_OP_DISPLAY_NAME,
	RANGE_OPS,
	BETWEEN_OP,
	GTE_OP,
	GT_OP,
	LTE_OP,
	LT_OP,
} from '../utils';

import { FilterContainer } from './common';
import './FilterContainerStyle.css';

const SUPPORTED_CONVERSIONS = {
	time: ['d', 'month', 'year'],
	digital: ['GB', 'B'],
};

const UNITS_DISPLAY_NAMES = {
	d: 'day',
};

const toUnitDisplayName = (unit) => UNITS_DISPLAY_NAMES[unit] || unit;

const supportedConversionFromUnit = (unit) => (unit ? SUPPORTED_CONVERSIONS[convert().describe(unit).measure] : null);

const normalizeNumericFieldOp = (fieldOp) => ({
	...fieldOp,
	content: {
		...fieldOp.content,
		value: Array.isArray(fieldOp.content.value)
			? [min(fieldOp.content.value), max(fieldOp.content.value)]
			: [fieldOp.content.value],
	},
});

const convertUnit = (sourceUnit, targetUnit) => (num) => {
	return sourceUnit && targetUnit ? convert(num).from(sourceUnit).to(targetUnit) : num;
};

export const RangeFilterUi = (props) => {
	const {
		field: fieldName = null,
		sqonPath = [],
		initialSqon = null,
		onSubmit = (sqon) => { },
		onCancel = () => { },
		fieldDisplayNameMap = {},
		opDisplayNameMap = FIELD_OP_DISPLAY_NAME,
		ContainerComponent = FilterContainer,
		InputComponent = (props) => <input {...props} className={`rangeFilterInput ${props.className || ''}`} />,
		unit: originalUnit = null,
	} = props;

	const initialFieldOp = (() => {
		const fieldOp = getOperationAtPath(sqonPath)(initialSqon);
		return fieldOp
			? normalizeNumericFieldOp(fieldOp)
			: {
				op: BETWEEN_OP,
				content: { value: [], field: fieldName || fieldOp.content.field },
			};
	})();
	const field = fieldName || initialFieldOp.content.field;
	const [state, setState] = useState({
		selectedOperation: initialFieldOp.op,
		minValue: min(initialFieldOp.content.value),
		maxValue: max(initialFieldOp.content.value),
		selectedUnit: originalUnit,
	});
	const mergeState = (patch) => setState((currentState) => ({ ...currentState, ...patch }));

	const onSqonSubmit = () => {
		const op = state.selectedOperation;
		const toOriginalUnit = convertUnit(state.selectedUnit, originalUnit);
		const min = toOriginalUnit(state.minValue);
		const max = toOriginalUnit(state.maxValue);
		const value = [GTE_OP, GT_OP].includes(op) ? [min] : [LTE_OP, LT_OP].includes(op) ? [max] : [min, max];

		const sqonToSubmit = {
			op,
			content: {
				field,
				value,
			},
		};
		onSubmit(setSqonAtPath(sqonPath, sqonToSubmit)(initialSqon));
	};

	const onOptionTypeChange = (e) => {
		mergeState({
			selectedOperation: e.target.value,
		});
	};

	const onMinimumChange = (e) => {
		mergeState({ minValue: e.target.value });
	};

	const onMaximumChange = (e) => {
		mergeState({ maxValue: e.target.value });
	};

	const onClearClick = (e) => {
		mergeState({
			maxValue: '',
			minValue: '',
		});
	};

	const unitOptions = supportedConversionFromUnit(originalUnit) || [];
	const onUnitOptionSelect = (e) => {
		mergeState({ selectedUnit: e.target.value });
	};

	const isMinimumDisabled = [LTE_OP, LT_OP].includes(state.selectedOperation);
	const isMaximumDisabled = [GTE_OP, GT_OP].includes(state.selectedOperation);

	const StyledInputComponent = (props) => (
		<InputComponent {...props} className={`rangeFilterInput ${props.className || ''}`} />
	);

	return (
		<ContainerComponent onSubmit={onSqonSubmit} onCancel={onCancel}>
			<div className="filterContent">
				<div className="contentSection">
					<span>{fieldDisplayNameMap[field] || field}</span> is{' '}
					<select onChange={onOptionTypeChange}>
						{RANGE_OPS.map((option) => (
							<option key={option} value={option} selected={state.selectedOperation === option}>
								{opDisplayNameMap[option]}
							</option>
						))}
					</select>
				</div>
				<div className="contentSection">
					<span onClick={onClearClick} className="aggsFilterAction">
						Clear
					</span>
				</div>
				<form className="contentSection">
					{unitOptions.map((unit) => (
						<label className="unitOptionLabel" key={unit}>
							<input
								type="radio"
								name={unit}
								value={unit}
								checked={state.selectedUnit === unit}
								onChange={onUnitOptionSelect}
							/>{' '}
							{toUnitDisplayName(unit)}
						</label>
					))}
				</form>
				<div className="contentSection">
					<div className="rangeInputContainer">
						<div className="inputField">
							<span className={`inputLabel ${isMinimumDisabled ? 'disabled' : ''}`}>From:</span>
							<StyledInputComponent
								disabled={isMinimumDisabled}
								value={state.minValue}
								type={'number'}
								onChange={onMinimumChange}
							/>
						</div>
						<div className="inputField">
							<span className={`inputLabel ${isMaximumDisabled ? 'disabled' : ''}`}>To:</span>
							<StyledInputComponent
								disabled={isMaximumDisabled}
								value={state.maxValue}
								type={'number'}
								onChange={onMaximumChange}
							/>
						</div>
					</div>
				</div>
			</div>
		</ContainerComponent>
	);
};

const RangeFilter = ({
	sqonPath = [],
	initialSqon = null,
	onSubmit = (sqon) => { },
	onCancel = () => { },
	fieldDisplayNameMap = {},
	opDisplayNameMap = FIELD_OP_DISPLAY_NAME,
	ContainerComponent = FilterContainer,
	InputComponent = (props) => <input {...props} />,
	unit = null,
	field,
}) => (
	<RangeFilterUi
		field={field}
		ContainerComponent={ContainerComponent}
		sqonPath={sqonPath}
		initialSqon={initialSqon}
		onSubmit={onSubmit}
		onCancel={onCancel}
		fieldDisplayNameMap={fieldDisplayNameMap}
		opDisplayNameMap={opDisplayNameMap}
		InputComponent={InputComponent}
		unit={unit}
	/>
);

// RangeFilter.prototype = {
// 	field: PropTypes.string,
// 	sqonPath: PropTypes.arrayOf(PropTypes.number),
// 	initialSqon: PropTypes.object,
// 	onSubmit: PropTypes.func,
// 	onCancel: PropTypes.func,
// 	fieldDisplayNameMap: PropTypes.objectOf(PropTypes.string),
// 	opDisplayNameMap: PropTypes.objectOf(PropTypes.string),
// 	ContainerComponent: PropTypes.func,
// 	InputComponent: PropTypes.func,
// 	unit: PropTypes.string,
// };

export default RangeFilter;
