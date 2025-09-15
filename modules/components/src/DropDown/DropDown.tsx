import { css } from '@emotion/react';
import Downshift from 'downshift';
import React, { useCallback, useState } from 'react';

import { ArrowIcon } from '#Icons/index.js';
import { useThemeContext } from '#ThemeContext/index.js';
import noopFn, { emptyObj } from '#utils/noops.js';

import './DropDown.css';
import type { DropDownProps } from './types.js';

const DropDown = ({
	arrowColor: customArrowColor,
	arrowTransition: customArrowTransition,
	hasSelectedRows,
	items,
	onChange = noopFn,
	itemToString,
	children,
	align = 'right',
	singleSelect = false,
}: DropDownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const theme = useThemeContext();

	const handleToggleMenu = useCallback((event: React.MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target?.attributes?.getNamedItem?.('disabled')) {
			setIsOpen((prev) => !prev);
		}
	}, []);

	const handleStateChange = useCallback((changes: any) => {
		const { isOpen: newIsOpen, type } = changes;

		if (type === '__autocomplete_click_button__') {
			setIsOpen(!newIsOpen);
		}
	}, []);

	const {
		components: {
			DropDown: {
				arrowColor: themeArrowColor,
				arrowTransition: themeArrowTransition,
				...themeArrowProps
			} = emptyObj,
		} = emptyObj,
	} = theme;

	const disableDownloads = items.every((item) => item.exporterRequiresRowSelection) && !hasSelectedRows;

	return (
		<Downshift
			itemToString={itemToString}
			onChange={onChange}
			selectedItem={items.filter((item) => item.show)}
			isOpen={isOpen}
			onStateChange={handleStateChange}
		>
			{({
				clearSelection,
				getButtonProps,
				getInputProps,
				getItemProps,
				highlightedIndex,
				inputValue,
				isOpen: downshiftIsOpen,
				selectedItem,
				toggleMenu,
			}) => (
				<div className="dropDownHeader">
					<button
						aria-label={`Show columns to select`}
						className="dropDownButton"
						{...getButtonProps({
							disabled: disableDownloads,
							onClick: handleToggleMenu,
						})}
					>
						<div className="dropDownButtonContent">{children}</div>
						<ArrowIcon
							css={css`
								margin-left: 0.3rem;
								margin-top: 0.1rem;
							`}
							fill={customArrowColor || themeArrowColor}
							pointUp={downshiftIsOpen}
							transition={customArrowTransition || themeArrowTransition}
							{...themeArrowProps}
						/>
					</button>

					{downshiftIsOpen && (
						<div
							className={`dropDownContent ${singleSelect ? 'single' : 'multiple'}`}
							style={{
								right: align === 'right' ? 0 : 'auto',
								left: align === 'right' ? 'auto' : 0,
							}}
							{...(singleSelect && { onClick: handleToggleMenu })}
						>
							{items.map((item, index) => {
								const { id, ...itemProps } = getItemProps({
									item,
									index,
									disabled: item.exporterRequiresRowSelection && !hasSelectedRows,
								});
								const label = itemToString(item);
								const labelIsComponent = React.isValidElement(label);
								return (
									<div
										className={`dropDownContentElement${labelIsComponent ? ' custom' : ' clickable'}`}
										key={item.id || id}
										{...itemProps}
									>
										{label}
										{!(singleSelect || labelIsComponent) && (
											<input
												readOnly
												type="checkbox"
												checked={selectedItem.indexOf(item) > -1}
												aria-label={`Select column ${item.id || (typeof label === 'string' ? label : id)}`}
											/>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}
		</Downshift>
	);
};

export default DropDown;
