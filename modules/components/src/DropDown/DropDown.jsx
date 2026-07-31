import Downshift from 'downshift';
import React from 'react';

import { ArrowIcon } from '#Icons/index';
import { withTheme } from '#ThemeContext/index';
import noopFn, { emptyObj } from '#utils/noops';

import './DropDown.css';

class DropDown extends React.Component {
	state = { isOpen: false };
	handleToggleMenu = (event) => {
		event.target?.attributes?.disabled || this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
	};
	handleStateChange = (changes) => {
		const { isOpen, type } = changes;

		if (type === '__autocomplete_click_button__') {
			this.setState({ isOpen: !isOpen });
		}
	};

	render() {
		const { isOpen } = this.state;
		const {
			arrowColor: customArrowColor,
			arrowTransition: customArrowTransition,
			hasSelectedRows,
			items,
			onChange = noopFn,
			itemToString,
			children,
			align = 'right',
			singleSelect = false,
			theme: {
				components: {
					DropDown: {
						arrowColor: themeArrowColor,
						arrowTransition: themeArrowTransition,
						...themeArrowProps
					} = emptyObj,
				} = emptyObj,
			} = emptyObj,
		} = this.props;

		const disableDownloads = items.every((item) => item.exporterRequiresRowSelection) && !hasSelectedRows;

		return (
			<Downshift
				itemToString={itemToString}
				onChange={onChange}
				selectedItem={items.filter((item) => item.show)}
				isOpen={isOpen}
				onStateChange={this.handleStateChange}
			>
				{({
					clearSelection,
					getButtonProps,
					getInputProps,
					getItemProps,
					highlightedIndex,
					inputValue,
					isOpen,
					selectedItem,
					toggleMenu,
				}) => (
					<div className="dropDownHeader">
						<button
							aria-label={`Show columns to select`}
							className="dropDownButton"
							{...getButtonProps({
								disabled: disableDownloads,
								onClick: this.handleToggleMenu,
							})}
						>
							<div className="dropDownButtonContent">{children}</div>
							<ArrowIcon
								style={{ marginLeft: '0.3rem', marginTop: '0.1rem' }}
								fill={customArrowColor || themeArrowColor}
								pointUp={isOpen}
								transition={customArrowTransition || themeArrowTransition}
								{...themeArrowProps}
							/>
						</button>

						{isOpen && (
							<div
								className={`dropDownContent ${singleSelect ? 'single' : 'multiple'}`}
								style={{
									right: align === 'right' ? 0 : 'auto',
									left: align === 'right' ? 'auto' : 0,
								}}
								{...(singleSelect && { onClick: this.handleToggleMenu })}
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
	}
}

export default withTheme(DropDown);
