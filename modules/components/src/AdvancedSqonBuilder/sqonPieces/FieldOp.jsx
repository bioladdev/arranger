import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

import defaultApiFetcher from '#utils/api';
import ClickAwayListener from '#utils/ClickAwayListener';

import FieldOpModifier from '../filterComponents/index';
import { DisplayNameMapContext, getOperationAtPath, FIELD_OP_DISPLAY_NAME, RANGE_OPS } from '../utils';

import { PillRemoveButton } from './common';

const FieldOp = (props) => {
	const {
		onSqonChange = (fullSqon) => { },
		onContentRemove = () => { },
		fullSyntheticSqon,
		sqonPath = [],
		opDisplayNameMap = FIELD_OP_DISPLAY_NAME,
		arrangerIndex,
		FieldOpModifierContainer = undefined,
		apiFetcher = defaultApiFetcher,
		getActiveExecutableSqon,
	} = props;

	const fieldOpObj = getOperationAtPath(sqonPath)(fullSyntheticSqon);
	const {
		op,
		content: { field, value },
	} = fieldOpObj;
	const [isOpen, setIsOpen] = useState(false);
	const onClickAway = () => setIsOpen(false);
	const toggleDropdown = () => setIsOpen((prev) => !prev);
	const onRemoveClick = () => {
		onContentRemove(fieldOpObj);
	};
	const onNewSqonSubmitted = (newSqon) => {
		onSqonChange(newSqon);
		toggleDropdown();
	};
	return (
		<DisplayNameMapContext.Consumer>
			{(fieldDisplayNameMap = {}) => (
				<span className={`fieldOp pill`}>
					<span className={'opContainer'}>
						<span className={`fieldName`}>{fieldDisplayNameMap[field] || field} </span>
						<span className={`opName`}>{` is ${(Array.isArray(value) && value.length > 1) || RANGE_OPS.includes(op) ? opDisplayNameMap[op] : ''
							} `}</span>
					</span>
					<ClickAwayListener className={'selectionContainer'} handler={onClickAway}>
						<span className={'valueDisplay'} onClick={toggleDropdown}>
							<Tooltip position="bottom" html={Array.isArray(value) ? value.join(', ') : value}>
								{Array.isArray(value) ? value.join(', ') : value}{' '}
							</Tooltip>
						</span>
						<span onClick={toggleDropdown}>
							<span style={{ pointerEvents: 'none' }}>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
						</span>
						{isOpen && (
							<div className={`fieldFilterContainer`}>
								<FieldOpModifier
									arrangerIndex={arrangerIndex}
									field={field}
									sqonPath={sqonPath}
									initialSqon={fullSyntheticSqon}
									onSubmit={onNewSqonSubmitted}
									onCancel={toggleDropdown}
									fieldDisplayNameMap={fieldDisplayNameMap}
									opDisplayNameMap={opDisplayNameMap}
									ContainerComponent={FieldOpModifierContainer}
									getExecutableSqon={getActiveExecutableSqon}
									apiFetcher={apiFetcher}
								/>
							</div>
						)}
					</ClickAwayListener>
					<PillRemoveButton onClick={onRemoveClick} />
				</span>
			)}
		</DisplayNameMapContext.Consumer>
	);
};

export default FieldOp;
