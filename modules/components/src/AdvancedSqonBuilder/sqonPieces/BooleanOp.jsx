import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import defaultApiFetcher from '#utils/api';
import ClickAwayListener from '#utils/ClickAwayListener';

import { isReference, isBooleanOp, isFieldOp, isEmptySqon } from '../utils';

import { PillRemoveButton } from './common';
import FieldOp from './FieldOp';

const SqonReference = (props) => {
	const { refIndex, onRemoveClick = () => { }, highlightColor, isHighlighted } = props;
	return (
		<span className={`sqonReference pill`}>
			<span
				className={'content sqonReferenceIndex'}
				style={
					!isHighlighted
						? {}
						: {
							background: highlightColor,
						}
				}
			>
				#{refIndex + 1}
			</span>
			<PillRemoveButton onClick={onRemoveClick} />
		</span>
	);
};

const LogicalOpSelector = (props) => {
	const { opName, onChange = (newOpName) => { } } = props;
	const [isOpen, setIsOpen] = useState(false);
	const selectionOptions = ['and', 'or'];
	const onClickAway = () => setIsOpen(false);
	const onClick = () => setIsOpen((prev) => !prev);
	const onselect = (option) => () => onChange(option);
	return (
		<ClickAwayListener handler={onClickAway}>
			<span
				className="pill logicalOpSelector"
				role="button"
				tabIndex={0}
				onClick={onClick}
				onKeyPress={onClick}
			>
				<span className={'content'} style={{ pointerEvents: 'none' }}>
					<span className={'opName'}>{opName}</span> {isOpen ? <FaChevronUp /> : <FaChevronDown />}
				</span>
				{isOpen && (
					<div className={`menuContainer`}>
						{selectionOptions.map((option) => (
							<div key={option} className="menuOption" onClick={onselect(option)} onKeyPress={onselect(option)}>
								{option}
							</div>
						))}
					</div>
				)}
			</span>
		</ClickAwayListener>
	);
};

/**
 * BooleanOp handles nested sqons through recursive rendering.
 * This will be useful for supporting brackets later.
 */
const BooleanOp = (props) => {
	const {
		arrangerIndex,
		contentPath = [],
		onFieldOpRemove = (path) => { },
		onChange = (changedPath, newOp) => { },
		sqon,
		fullSyntheticSqon = sqon,
		FieldOpModifierContainer = undefined,
		apiFetcher = defaultApiFetcher,
		getActiveExecutableSqon,
		getColorForReference = () => '',
		isIndexReferenced = () => false,
		referencesShouldHighlight = false,
	} = props;
	const { op, content } = sqon;
	const onOpChange = (newOpName) =>
		onChange(contentPath, {
			op: newOpName,
			content,
		});
	const onNewSqonSubmit = (newSqon) => onChange([], newSqon); // FieldOp dispatches a full sqon on change
	const onRemove = (path) => () => onFieldOpRemove(path);
	return (
		<span className={`booleanOp`}>
			{content.map((c, i) => {
				const currentPath = [...contentPath, i];
				return (
					<span key={i}>
						{isBooleanOp(c) ? (
							<span>
								<span className="nestedOpBracket">(</span>
								<BooleanOp {...props} sqon={c} fullSyntheticSqon={fullSyntheticSqon} contentPath={currentPath} />
								<span className="nestedOpBracket">)</span>
							</span>
						) : isFieldOp(c) ? (
							<span>
								<FieldOp
									arrangerIndex={arrangerIndex}
									sqonPath={currentPath}
									fullSyntheticSqon={fullSyntheticSqon}
									onContentRemove={onRemove(currentPath)}
									onSqonChange={onNewSqonSubmit}
									FieldOpModifierContainer={FieldOpModifierContainer}
									apiFetcher={apiFetcher}
									getActiveExecutableSqon={getActiveExecutableSqon}
								/>
							</span>
						) : isReference(c) ? (
							<SqonReference
								refIndex={c}
								onRemoveClick={onRemove(currentPath)}
								highlightColor={getColorForReference(c)}
								isHighlighted={referencesShouldHighlight && isIndexReferenced(c)}
							/>
						) : isEmptySqon(c) ? (
							<span>empty sqon is not yet supported here</span>
						) : null}
						{i < content.length - 1 && <LogicalOpSelector opName={op} onChange={onOpChange} />}
					</span>
				);
			})}
		</span>
	);
};

export default BooleanOp;
