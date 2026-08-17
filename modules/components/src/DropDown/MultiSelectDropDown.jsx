import cx from 'classnames';
import { merge } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import Button, { TransparentButton } from '#Button/index';
import { ArrowIcon, CheckIcon, ResetIcon } from '#Icons/index';
import TextFilter from '#TextFilter/index';
import TextHighlight from '#TextHighlight/index';
import { useThemeContext } from '#ThemeContext/index';
import noopFn, { emptyObj } from '#utils/noops';
import strToReg from '#utils/strToReg';
import internalTranslateSQONValue from '#utils/translateSQONValue';

import styles from './MultiSelectDropDown.module.css';

/**
 *  * @param {Object} props
 * @param {string} [props.align="right"]
 * @param {boolean} [props.allowControls]
 * @param {boolean} [props.allowSelection]
 * @param {string} [props.buttonAriaLabelClosed]
 * @param {string} [props.buttonAriaLabelOpen]
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {string} [props.itemSelectionLegend]
 * @param {unknown[]} [props.items]
 * @param {function} [props.itemToString]
 * @param {function} [props.onChange]
 * @param {string} [props.resetToDefaultAriaLabel]
 * @param {string} [props.selectAllAriaLabel]
 * @param {Object} [props.theme]
 * @param {React.ReactNode} props.children
 */
const DropDownMenu = ({
	align = 'right',
	allowControls = false,
	allowSelection = false,
	buttonAriaLabelClosed = 'Open selection menu',
	buttonAriaLabelOpen = 'Close selection menu',
	children,
	className: customClassName = '',
	disabled = false,
	items = [],
	itemSelectionLegend = 'Select items',
	itemToString = (item, closeDropDown = noopFn) => item.label,
	onChange = noopFn,
	resetToDefaultAriaLabel = 'Reset to default selection',
	selectAllAriaLabel = 'Select all items',
	selectionProperty = 'show',
	selectionValues = [true],
	theme: {
		arrowColor: customArrowColor,
		arrowDisabledColor: customArrowDisabledColor,
		arrowTransition: customArrowTransition,
		style: customDropDownButtonCSS,
		disabledFontColor: customDropDownDisabledFontColor,
		enableFilter: customDropdownEnableFilter,
		filterPlaceholder: customDropdownFilterPlaceholder,
		fontColor: customDropDownFontColor,

		// Child Components
		ListWrapper: {
			background: customListWrapperBackground,
			borderColor: customListWrapperBorderColor,
			borderRadius: customListWrapperBorderRadius,
			style: customListWrapperCSS,
			fontColor: customListWrapperFontColor = customDropDownFontColor,
			fontSize: customListWrapperFontSize,
			hoverBackground: customListWrapperHoverBackground,
			maxHeight: customListWrapperMaxHeight,
			width: customListWrapperWidth,
		} = emptyObj,
		SelectionControls: {
			fontColor: customSelectionControlFontColor = customListWrapperFontColor,
			fontSize: customSelectionControlFontSize = customListWrapperFontSize,
			hoverBackground: customSelectionControlHoverBackground = customListWrapperHoverBackground,
			...customSelectionControlProps
		} = emptyObj,
		TextFilter: customTextFilterProps,
		...customDropDownButtonProps
	} = emptyObj,
}) => {
	const [instanceId] = useState(uuid()); // to prevent ID collisions between different dropdowns
	const [allSelected, setAllSelected] = useState(null);
	const [isDisabled, setIsDisabled] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const buttonRef = useRef();
	const itemsRef = useRef([]);
	const panelRef = useRef();
	const renderRef = useRef();
	const {
		components: {
			DropDown: {
				arrowColor: themeArrowColor,
				arrowDisabledColor: themeArrowDisabledColor,
				arrowTransition: themeArrowTransition,
				className: themeClassName,
				style: themeDropDownButtonCSS,
				disabledFontColor: themeDropDownDisabledFontColor,
				enableFilter: themeDropdownEnableFilter,
				filterPlaceholder: themeDropdownFilterPlaceholder,
				fontColor: themeDropDownFontColor,

				// Child Components
				ListWrapper: {
					background: themeListWrapperBackground,
					borderColor: themeListWrapperBorderColor,
					borderRadius: themeListWrapperBorderRadius,
					style: themeListWrapperCSS,
					fontColor: themeListWrapperFontColor = themeDropDownFontColor,
					fontSize: themeListWrapperFontSize,
					hoverBackground: themeListWrapperHoverBackground,
					maxHeight: themeListWrapperMaxHeight,
					width: themeListWrapperWidth,
				} = emptyObj,
				SelectionControls: {
					fontColor: themeSelectionControlFontColor = themeListWrapperFontColor,
					fontSize: themeSelectionControlFontSize = themeListWrapperFontSize,
					hoverBackground: themeSelectionControlHoverBackground = themeListWrapperHoverBackground,
					...themeSelectionControlProps
				} = emptyObj,
				TextFilter: themeTextFilterProps,
				...themeDropDownButtonProps
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'DropDownMenu' });

	const enableFilter = customDropdownEnableFilter || themeDropdownEnableFilter;
	const filterPlaceholder = customDropdownFilterPlaceholder || themeDropdownFilterPlaceholder;
	const fontColor = customDropDownFontColor || themeDropDownFontColor;
	const disabledFontColor = customDropDownDisabledFontColor || themeDropDownDisabledFontColor;
	const buttonTheme = merge(
		{
			fontColor,
			disabledFontColor,
		},
		themeDropDownButtonProps,
		customDropDownButtonProps,
	);

	const checkSelected = useCallback(
		(item, values) => (values || selectionValues).includes(item[selectionProperty]),
		[selectionProperty, selectionValues],
	);

	const checkIfAllSelected = useCallback(
		(values) => items.length > 0 && items.every((item) => checkSelected(item, values)),
		[checkSelected, items],
	);

	const focusNext = (item) => {
		itemsRef.current?.[(item + 1) % items.length]?.focus?.();
	};

	const focusPrev = (item) => {
		itemsRef.current?.[(item - 1 + items.length) % items.length]?.focus?.();
	};

	const focusFirst = () => {
		itemsRef.current?.[0]?.focus?.();
	};

	const focusLast = () => {
		itemsRef.current?.[items.length - 1]?.focus?.();
	};

	const handleAction = useCallback((event) => {
		event?.preventDefault?.();
		setIsOpen((isOpen) => !isOpen);
	}, []);

	const handleBlur = useCallback(
		(event) => {
			const nextTarget = event.relatedTarget;

			panelRef.current && !panelRef.current?.contains?.(nextTarget) && handleAction();
		},
		[handleAction, panelRef],
	);

	const handleClickOutside = useCallback(
		(event) => {
			if (panelRef.current && !panelRef.current?.contains?.(event.target) && event.target !== buttonRef.current) {
				handleAction();
			}
		},
		[buttonRef, handleAction, panelRef],
	);

	const handleEsc = useCallback(
		(event) => {
			if (event.key === 'Escape') {
				handleAction();
				isOpen && buttonRef.current?.focus?.();
			}
		},
		[handleAction, isOpen],
	);

	const handleChangeSearchText = ({ value }) => {
		setSearchText(value || '');
	};

	const handleKeyPress = (item) => (event) => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				focusNext(item);
				break;

			case 'ArrowUp':
				event.preventDefault();
				focusPrev(item);
				break;

			case 'Home':
				event.preventDefault();
				focusFirst();
				break;

			case 'End':
				event.preventDefault();
				focusLast();
				break;

			default:
				break;
		}
	};

	const handleReset = (event) => {
		event.preventDefault();

		onChange?.(event, 'reset');
	};

	const handleSelectAll = useCallback(
		(event) => {
			event.preventDefault();

			const value =
				// if (allSelected === 'all') then it needs to turn to 'none' (make all items show:false)
				!(allSelected === 'all') ||
				// or (allSelected === 'none') then it needs to turn to 'all' (make all items show:true)
				allSelected === 'none' ||
				// or (allSelected === false), then same as above (all items show:true)
				!allSelected;

			onChange?.(event, 'all', value);
		},
		[allSelected, onChange],
	);

	const handleSelectOne = (item) => (event) => {
		onChange?.(event, 'one', item);
	};

	const selectionButtonsTheme = merge(
		{
			fontColor: customSelectionControlFontColor || themeSelectionControlFontColor,
			fontSize: customSelectionControlFontSize || themeSelectionControlFontSize,
			hoverBackground: customSelectionControlHoverBackground || themeSelectionControlHoverBackground,
			whiteSpace: 'nowrap',
		},
		themeSelectionControlProps,
		customSelectionControlProps,
	);

	useEffect(() => {
		// check if all items are selected
		if (checkIfAllSelected([true])) {
			setAllSelected('all');
		}
		// or if all items are deselected
		else if (checkIfAllSelected([false])) {
			setAllSelected('none');
		}
	}, [allSelected, checkIfAllSelected]);

	useEffect(() => {
		if (renderRef && !renderRef.current) {
			itemsRef.current = new Array(items.length);
			renderRef.current = true;
		}
	}, [items, renderRef]);

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('click', handleClickOutside);
			window.addEventListener('keydown', handleEsc);
			focusFirst();
		}

		return () => {
			window.removeEventListener('click', handleClickOutside);
			window.removeEventListener('keydown', handleEsc);
		};
	}, [handleClickOutside, handleEsc, isOpen]);

	useEffect(() => {
		setIsDisabled(disabled || items.length < 1);
	}, [disabled, items]);

	/** @type {import('react').CSSProperties & Record<`--arranger-list-wrapper-${string}`, string | undefined>} */
	const listWrapperThemeStyle = {
		'--arranger-list-wrapper-background': customListWrapperBackground || themeListWrapperBackground,
		'--arranger-list-wrapper-border-color': customListWrapperBorderColor || themeListWrapperBorderColor,
		'--arranger-list-wrapper-border-radius': customListWrapperBorderRadius || themeListWrapperBorderRadius,
		'--arranger-list-wrapper-font-color': customListWrapperFontColor || themeListWrapperFontColor,
		'--arranger-list-wrapper-font-size': customListWrapperFontSize || themeListWrapperFontSize,
		'--arranger-list-wrapper-max-height': customListWrapperMaxHeight || themeListWrapperMaxHeight,
		'--arranger-list-wrapper-width': customListWrapperWidth || themeListWrapperWidth,
	};

	/** @type {import('react').CSSProperties & Record<`--arranger-selection-control-${string}`, string | undefined>} */
	const selectionButtonThemeStyle = {
		'--arranger-selection-control-font-color': customSelectionControlFontColor || themeSelectionControlFontColor,
		'--arranger-selection-control-font-size': customSelectionControlFontSize || themeSelectionControlFontSize,
	};

	return (
		<article className={cx(styles.dropdownContainer, customClassName, themeClassName)}>
			<Button
				aria-label={isOpen ? buttonAriaLabelOpen : buttonAriaLabelClosed}
				aria-haspopup="true"
				aria-expanded={isOpen}
				className={styles.dropDownButton}
				style={{
					'--arranger-multi-select-font-color': fontColor,
					...themeDropDownButtonCSS,
					...customDropDownButtonCSS,
				}}
				disabled={isDisabled}
				onBlur={handleBlur}
				onClick={handleAction}
				ref={buttonRef}
				theme={buttonTheme}
			>
				{children}

				<ArrowIcon
					style={{ marginLeft: '0.3rem', marginTop: '0.1rem' }}
					disabled={isDisabled}
					pointUp={isOpen}
					theme={{
						disabledFill: customArrowDisabledColor || themeArrowDisabledColor || disabledFontColor,
						fill: customArrowColor || themeArrowColor || fontColor,
						transition: customArrowTransition || themeArrowTransition,
					}}
				/>
			</Button>

			{isOpen && (
				<fieldset
					className={styles.listWrapper}
					data-align={align === 'right' ? 'right' : 'left'}
					style={{ ...listWrapperThemeStyle, ...themeListWrapperCSS, ...customListWrapperCSS }}
					ref={panelRef}
				>
					<legend className={styles.legend}>{itemSelectionLegend}</legend>

					{allowControls && allowSelection && (
						<section className={styles.selectionControls}>
							<TransparentButton
								aria-label={selectAllAriaLabel}
								className={styles.selectionButton}
								style={selectionButtonThemeStyle}
								onClick={handleSelectAll}
								theme={selectionButtonsTheme}
							>
								<CheckIcon />
								{allSelected === 'all' ? 'Deselect' : 'Select'} All
							</TransparentButton>

							<TransparentButton
								aria-label={resetToDefaultAriaLabel}
								className={styles.selectionButton}
								style={selectionButtonThemeStyle}
								onClick={handleReset}
								theme={selectionButtonsTheme}
							>
								<ResetIcon />
								Reset
							</TransparentButton>
						</section>
					)}

					{enableFilter && (
						<TextFilter
							onChange={handleChangeSearchText}
							theme={{
								altText: `Search data`,
								placeholder: filterPlaceholder,
								...themeTextFilterProps,
								...customTextFilterProps,
							}}
							value={searchText}
						/>
					)}

					{items.length > 0 ? (
						<ul
							className={styles.list}
							style={listWrapperThemeStyle}
						>
							{items
								.filter(
									(item) =>
										// Filters out values that don't match the TextFilter's input
										!searchText || internalTranslateSQONValue(itemToString(item)).match(strToReg(searchText)),
								)
								.map((item, index) => {
									// TODO: find a better fallback than "index"
									const itemId = `${instanceId}--${item.accessor || index}`;

									return (
										<li
											className={styles.listItem}
											key={itemId}
										>
											<label
												className={styles.listItemLabel}
												data-selectable={allowSelection}
												style={listWrapperThemeStyle}
											>
												{allowSelection && ( // checkbox
													<input
														checked={checkSelected(item)}
														className={styles.listItemCheckbox}
														id={itemId}
														name={itemId}
														onBlur={index === items.length - 1 ? handleBlur : undefined}
														onChange={handleSelectOne(item)}
														onKeyDown={handleKeyPress(index)}
														ref={(el) => (itemsRef.current[index] = el)}
														type="checkbox"
													/>
												)}
												{enableFilter ? (
													<TextHighlight content={itemToString(item)} highlightText={searchText} />
												) : (
													itemToString(item, handleAction)
												)}
											</label>
										</li>
									);
								})}
						</ul>
					) : (
						'No items to display'
					)}
				</fieldset>
			)}
		</article>
	);
};

export default DropDownMenu;
