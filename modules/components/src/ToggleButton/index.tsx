import cx from 'classnames';

import Button from '#Button/index';
import { useThemeContext } from '#ThemeContext/index';
import noopFn, { emptyObj } from '#utils/noops';

import type Props from './types';

// TODO: temprorarily quieting down TS errors to help migration
/**
 * @param {*} props
 */
const ToggleButton = ({
	className,
	onChange = noopFn,
	options = [],
	value: selectedValue = '',
	theme: {
		activeBackground: customActiveBackground,
		activeBorderColor: customActiveBorderColor,
		activeFontColor: customActiveFontColor,
		activeFontSize: customActiveFontSize,
		background: customBackground,
		borderRadius: customBorderRadius,
		borderColor: customBorderColor,
		className: customClassName,
		style: customCSS,
		disabledBackground: customDisabledBackground,
		disabledBorderColor: customDisabledBorderColor,
		disabledFontColor: customDisabledFontColor,
		disabledFontSize: customDisabledFontSize,
		fontColor: customFontColor,
		fontSize: customFontSize,
		OptionCSS: customOptionCSS,
	} = emptyObj,
}: Props) => {
	const {
		colors,
		components: {
			Aggregations: {
				ToggleButton: {
					activeBackground: themeActiveBackground = colors?.grey?.[200],
					activeBorderColor: themeActiveBorderColor,
					activeFontColor: themeActiveFontColor,
					activeFontSize: themeActiveFontSize,
					background: themeBackground = colors?.grey?.[50],
					borderRadius: themeBorderRadius = '0.9rem 50%',
					borderColor: themeBorderColor = colors?.grey?.[600],
					className: themeClassName = '',
					style: themeCSS,
					disabledBackground: themeDisabledBackground = colors?.grey?.[200],
					disabledBorderColor: themeDisabledBorderColor,
					disabledFontColor: themeDisabledFontColor = colors?.grey?.[700],
					disabledFontSize: themeDisabledFontSize,
					fontColor: themeFontColor,
					fontSize: themeFontSize = '0.9rem',
					OptionCSS: themeOptionCSS,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'ToggleButton' });

	return (
		<div
			className={cx('toggle-button', className, customClassName, themeClassName)}
			style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: `calc(${themeFontSize} * 2)`, ...themeCSS, ...customCSS }}
		>
			{options.map(({ disabled = false, title, value = '' }, index) => {
				const active = selectedValue === value;
				const clickHandler = () => (disabled ? null : onChange({ value }));

				return (
					// TODO: restore active/disabled/border-radius pseudo-selector styles via CSS
					<Button
						className={cx('toggle-button-option', {
							active,
							disabled,
						})}
						style={{
							background: customBackground || themeBackground,
							border: '0.1rem solid',
							borderColor: customBorderColor || themeBorderColor,
							color: customFontColor || themeFontColor,
							flex: 1,
							fontSize: customFontSize || themeFontSize,
							padding: '5px',
							...themeOptionCSS,
							...customOptionCSS,
						}}
						disabled={disabled}
						key={value || `undefined-${index}`}
						onClick={clickHandler}
					>
						{typeof title === 'function' ? title({ toggleStatus: cx({ active, disabled }) }) : title}
					</Button>
				);
			})}
		</div>
	);
};
export default ToggleButton;
