import cx from 'classnames';
import { createRef, type CSSProperties, type ForwardedRef, forwardRef, type MouseEventHandler } from 'react';

import { useThemeContext } from '#ThemeContext/index';
import { withTooltip } from '#Tooltip/index';
import noopFn, { emptyObj } from '#utils/noops';

import styles from './styles.module.css';
import type { ButtonProps } from './types';

const propagationStopper =
	(clickHandler: MouseEventHandler | undefined = noopFn): MouseEventHandler =>
	(event) => {
		event.stopPropagation();
		clickHandler?.(event);
	};

type ButtonCustomProperties = CSSProperties &
	Record<`--arranger-button-${string}` | `--arranger-transparent-button-${string}`, string | number | undefined>;

interface BaseButtonInnerProps extends ButtonProps {
	forwardedRef?: ForwardedRef<HTMLButtonElement>;
}

const BaseButtonInner = ({
	children,
	className,
	disabled,
	forwardedRef,
	hidden,
	onClick,
	style: customStyle,
	theme: {
		background = undefined,
		borderColor = undefined,
		borderRadius = undefined,
		disabledBackground = undefined,
		disabledBorderColor = undefined,
		disabledFontColor = undefined,
		flex = undefined,
		fontColor = undefined,
		fontFamily = undefined,
		fontSize = undefined,
		fontWeight = undefined,
		height = undefined,
		hoverBackground = undefined,
		letterSpacing = undefined,
		lineHeight = undefined,
		margin = undefined,
		padding = undefined,
		position = undefined,
		textTransform = undefined,
		whiteSpace = undefined,
		width = undefined,
	} = emptyObj,
	...rest
}: BaseButtonInnerProps) => {
	const isDisabled = disabled || className?.split(' ').includes('disabled');

	const themeStyle: ButtonCustomProperties = {
		'--arranger-button-background': background,
		'--arranger-button-border-color': borderColor,
		'--arranger-button-border-radius': borderRadius,
		'--arranger-button-disabled-background': disabledBackground,
		'--arranger-button-disabled-border-color': disabledBorderColor,
		'--arranger-button-disabled-font-color': disabledFontColor,
		'--arranger-button-flex': flex,
		'--arranger-button-font-color': fontColor,
		'--arranger-button-font-family': fontFamily,
		'--arranger-button-font-size': fontSize,
		'--arranger-button-font-weight': fontWeight,
		'--arranger-button-height': height,
		'--arranger-button-hover-background': hoverBackground,
		'--arranger-button-letter-spacing': letterSpacing,
		'--arranger-button-line-height': lineHeight,
		'--arranger-button-margin': margin,
		'--arranger-button-padding': padding,
		'--arranger-button-position': position,
		'--arranger-button-text-transform': textTransform,
		'--arranger-button-white-space': whiteSpace,
		'--arranger-button-width': width,
	};

	return (
		<button
			className={cx(styles.button, className)}
			data-clickable={typeof onClick === 'function'}
			data-disabled={Boolean(isDisabled)}
			data-hidden={Boolean(hidden)}
			disabled={disabled}
			onClick={onClick}
			ref={forwardedRef as React.Ref<HTMLButtonElement>}
			style={{ ...themeStyle, ...customStyle }}
			{...rest}
		>
			{children}
		</button>
	);
};

const BaseButtonWithTooltip = withTooltip(BaseButtonInner);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			theme: {
				background: customBackground,
				borderColor: customBorderColor,
				borderRadius: customBorderRadius,
				disabledBackground: customDisabledBackground,
				disabledBorderColor: customDisabledBorderColor,
				disabledFontColor: customDisabledFontColor,
				fontColor: customFontColor,
				fontSize: customFontSize,
				lineHeight: customLineHeight,
				...customThemeProps
			} = emptyObj,
			onClick,
			...props
		},
		ref?: ForwardedRef<HTMLButtonElement>,
	) => {
		// manual displayname setting required due to forwardRef
		Button.displayName = 'Button';

		const forwardedRef = ref || createRef();

		const {
			components: {
				Button: {
					background: themeBackground,
					borderColor: themeBorderColor,
					borderRadius: themeBorderRadius,
					disabledBackground: themeDisabledBackground,
					disabledBorderColor: themeDisabledBorderColor,
					disabledFontColor: themeDisabledFontColor,
					fontColor: themeFontColor,
					fontSize: themeFontSize,
					lineHeight: themeLineHeight,
					...themeProps
				} = emptyObj,
			} = emptyObj,
		} = useThemeContext({
			callerName: 'Button',
		});

		return (
			<BaseButtonWithTooltip
				forwardedRef={forwardedRef}
				onClick={propagationStopper(onClick)}
				theme={{
					background: customBackground || themeBackground,
					borderColor: customBorderColor || themeBorderColor,
					borderRadius: customBorderRadius || themeBorderRadius,
					disabledBackground: customDisabledBackground || themeDisabledBackground,
					disabledBorderColor: customDisabledBorderColor || themeDisabledBorderColor,
					disabledFontColor: customDisabledFontColor || themeDisabledFontColor,
					fontColor: customFontColor || themeFontColor,
					fontSize: customFontSize || themeFontSize,
					lineHeight: customLineHeight || themeLineHeight,
					...themeProps,
					...customThemeProps,
				}}
				{...props}
			>
				{children}
			</BaseButtonWithTooltip>
		);
	},
);

const TransparentButtonBase = ({
	children,
	className,
	style: customStyle,
	theme: {
		background = undefined,
		borderColor = undefined,
		fontColor = undefined,
		fontFamily = undefined,
		hoverFontColor = undefined,
		margin = undefined,
		padding = undefined,
	} = emptyObj,
	onClick,
	...props
}: ButtonProps) => {
	const hasHoverColor = Boolean(hoverFontColor || (fontColor && fontColor !== 'inherit'));

	const themeStyle: ButtonCustomProperties = {
		'--arranger-transparent-button-background': background,
		'--arranger-transparent-button-border': borderColor ? `0.1rem solid ${borderColor}` : undefined,
		'--arranger-transparent-button-color': fontColor,
		'--arranger-transparent-button-font-family': fontFamily,
		'--arranger-transparent-button-hover-color': hoverFontColor,
		'--arranger-transparent-button-margin': margin,
		'--arranger-transparent-button-padding': padding,
	};

	return (
		<Button
			className={cx(styles.transparentButton, className)}
			data-has-hover-color={hasHoverColor}
			onClick={onClick}
			style={{ ...themeStyle, ...customStyle }}
			theme={{}}
			{...props}
		>
			{children}
		</Button>
	);
};

export const TransparentButton = ({
	className,
	disabled,
	onClick,
	theme: { style: themeStyle, ...theme } = emptyObj,
	...props
}: ButtonProps & {
	onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
	return (
		<TransparentButtonBase
			className={cx(className, disabled && 'disabled')}
			style={themeStyle}
			onClick={disabled ? undefined : propagationStopper(onClick)}
			theme={theme}
			{...props}
		/>
	);
};

export default Button;
