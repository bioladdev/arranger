import cx from 'classnames';
import { createRef, forwardRef, useState } from 'react';

import Button from '#Button/index';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

// TODO: study custom vs theme handlers, figure out whether both or which.
// TODO: change component props to {...,theme} model

const Input = (
	{
		className,
		disabled: customDisabled,
		onBlur: customBlurHandler,
		onChange: customChangeHandler,
		onFocus: customFocusHandler,
		theme: {
			borderColor: customBorderColor,
			boxShadow: customBoxShadow,
			ClearButton: CustomClearButton,
			clearButtonAltText: customClearAltText,
			Component: CustomComponent,
			style: customStyle,
			leftIcon: { Icon: CustomLeftIcon, ...customLeftIconProps } = emptyObj,
			margin: customMargin,
			padding: customPadding,
			placeholder: customPlaceholder,
			rightIcon: { Icon: CustomRightIcon, ...customRightIconProps } = emptyObj,
			showClear: customShowClear,
		} = emptyObj,
		...props
	},
	ref,
) => {
	const [internalValue, setInternalValue] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const {
		colors,
		components: {
			Input: {
				borderColor: themeBorderColor = colors?.grey?.[600],
				boxShadow: themeBoxShadow = `inset 0 0 3px 0 ${colors?.grey?.[400]}`,
				clearAltText: themeClearAltText = 'Clear text',
				Component: ThemeComponent = 'input',
				ClearButton: ThemeClearButton = Button,
				style: themeStyle,
				disabled: themeDisabled,
				disabledBorderColor: themeDisabledBorderColor = colors?.grey?.[300],
				LeftIcon: ThemeLeftIcon,
				margin: themeMargin = '0',
				padding: themePadding,
				onChange: themeChangeHandler,
				onBlur: themeBlurHandler,
				onFocus: themeFocusHandler,
				placeholder: themePlaceHolder,
				RightIcon: ThemeRightIcon,
				showClear: themeShowClear = false,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Input' });

	const ClearButton = CustomClearButton || ThemeClearButton;
	const Component = CustomComponent || ThemeComponent;
	const LeftIcon = CustomLeftIcon || ThemeLeftIcon;
	const RightIcon = CustomRightIcon || ThemeRightIcon;

	const borderColor = customBorderColor || themeBorderColor;
	const boxShadow = customBoxShadow || themeBoxShadow;
	const clearAltText = `${customClearAltText || themeClearAltText}${internalValue ? '' : ' (disabled)'}`;
	const margin = customMargin || themeMargin;
	const padding = customPadding || themePadding;
	const placeholder = customPlaceholder || themePlaceHolder;
	const showClear = customShowClear || themeShowClear;

	const inputRef = ref || createRef();
	const clearButtonRef = createRef();
	const inputDisabled = customDisabled || themeDisabled;

	const blurHandler = (event) => {
		setIsFocused(false);
		customBlurHandler?.(event);
		themeBlurHandler?.(event);
	};

	const changeHandler = (event) => {
		setInternalValue(event.target.value);
		customChangeHandler?.(event);
		themeChangeHandler?.(event);
	};

	const clearHandler = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setInternalValue('');
		customChangeHandler?.('');
		themeChangeHandler?.('');
	};

	const focusHandler = (event) => {
		setIsFocused(true);
		customFocusHandler?.(event);
		themeFocusHandler?.(event);
	};

	return (
		<div
			className={cx('inputWrapper', { disabled: inputDisabled, focused: isFocused }, className)}
			style={{
				alignItems: 'center',
				border: `solid 1px ${inputDisabled ? themeDisabledBorderColor : borderColor}`,
				borderRadius: '5px',
				boxSizing: 'border-box',
				boxShadow: isFocused ? boxShadow : undefined,
				display: 'flex',
				flex: 1,
				justifyContent: 'center',
				margin,
				overflow: 'hidden',
				padding: padding ?? '5px',
				...themeStyle,
				...customStyle,
			}}
			onClick={(e) => {
				if (inputRef.current && e.target !== clearButtonRef?.current) inputRef.current.focus();
			}}
			onFocus={(e) => {
				if (inputRef.current && e.target !== clearButtonRef?.current) inputRef.current.focus();
			}}
		>
			{LeftIcon && (
				<span
					className="inputIcon"
					style={{ color: 'lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				>
					<LeftIcon {...customLeftIconProps} />
				</span>
			)}

			<Component
				style={{ border: 'none', width: '100%' }}
				disabled={inputDisabled}
				onBlur={blurHandler}
				onChange={changeHandler}
				onFocus={focusHandler}
				placeholder={placeholder}
				ref={inputRef}
				value={internalValue}
				{...props}
			/>

			{showClear && (
				<ClearButton
					aria-label={clearAltText}
					disabled={inputDisabled || !internalValue}
					onClick={clearHandler}
					ref={clearButtonRef}
					theme={{
						fontSize: '0.65rem',
						lineHeight: '1rem',
						margin: '0 0 0 5px',
						padding: '0 0.3rem',
					}}
					title={clearAltText}
				>
					X
				</ClearButton>
			)}

			{RightIcon && (
				<span
					className="inputRightIcon"
					style={{ color: 'lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				>
					<RightIcon {...customRightIconProps} />
				</span>
			)}
		</div>
	);
};

export default forwardRef(Input);
