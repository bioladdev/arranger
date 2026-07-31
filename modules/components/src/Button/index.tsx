import cx from 'classnames';
import Color from 'color';
import { createRef, type CSSProperties, type ForwardedRef, forwardRef, type MouseEventHandler, useState } from 'react';

import { useThemeContext } from '#ThemeContext/index';
import { withTooltip } from '#Tooltip/index';
import noopFn, { emptyObj } from '#utils/noops';

import type { ButtonProps } from './types';

const propagationStopper =
	(clickHandler: MouseEventHandler | undefined = noopFn): MouseEventHandler =>
	(event) => {
		event.stopPropagation();
		clickHandler?.(event);
	};

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
		position = 'relative',
		textTransform = undefined,
		whiteSpace = undefined,
		width = undefined,
	} = emptyObj,
	...rest
}: BaseButtonInnerProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const isDisabled = disabled || className?.split(' ').includes('disabled');

	const style: CSSProperties = {
		alignItems: 'center',
		background: isDisabled ? disabledBackground : isHovered ? hoverBackground : background,
		boxSizing: 'border-box',
		border: isDisabled
			? disabledBorderColor
				? `0.08rem solid ${disabledBorderColor}`
				: undefined
			: borderColor
				? `0.08rem solid ${borderColor}`
				: undefined,
		borderRadius,
		color: isDisabled ? disabledFontColor : fontColor,
		cursor: typeof onClick === 'function' ? 'pointer' : 'default',
		display: 'flex',
		flex,
		fontFamily,
		fontSize,
		fontWeight,
		height,
		justifyContent: 'center',
		letterSpacing,
		lineHeight,
		margin,
		padding,
		pointerEvents: hidden ? 'none' : undefined,
		position,
		textTransform: textTransform as CSSProperties['textTransform'],
		visibility: hidden ? 'hidden' : undefined,
		whiteSpace: whiteSpace as CSSProperties['whiteSpace'],
		width,
		...customStyle,
	};

	return (
		<button
			className={className}
			disabled={disabled}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			ref={forwardedRef as React.Ref<HTMLButtonElement>}
			style={style}
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
			colors,
			components: {
				Button: {
					background: themeBackground = colors?.grey?.[100],
					borderColor: themeBorderColor = colors?.grey?.[400],
					borderRadius: themeBorderRadius = '0.3rem',
					disabledBackground: themeDisabledBackground = colors?.grey?.[100],
					disabledBorderColor: themeDisabledBorderColor = colors?.grey?.[300],
					disabledFontColor: themeDisabledFontColor = colors?.grey?.[300],
					fontColor: themeFontColor = '0.85rem',
					fontSize: themeFontSize = '0.85rem',
					lineHeight: themeLineHeight = '1.3rem',
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
		background = 'none',
		borderColor = undefined,
		fontColor = 'inherit',
		fontFamily = 'inherit',
		hoverFontColor = undefined,
		margin = 0,
		padding = 0,
	} = emptyObj,
	onClick,
	...props
}: ButtonProps) => {
	const [isHovered, setIsHovered] = useState(false);

	const derivedHoverColor =
		hoverFontColor ||
		(fontColor && fontColor !== 'inherit' ? Color(fontColor).lighten(0.3).string() : undefined);

	const style: CSSProperties = {
		background,
		border: borderColor ? `0.1rem solid ${borderColor}` : 'none',
		color: isHovered ? derivedHoverColor : fontColor,
		fontFamily,
		justifyContent: 'flex-start',
		margin,
		padding,
		textAlign: 'left',
		...customStyle,
	};

	return (
		<Button
			className={className}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
			style={style}
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
