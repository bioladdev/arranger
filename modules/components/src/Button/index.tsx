import cx from 'classnames';
import Color from 'color';
import {
	createRef,
	type CSSProperties,
	type ForwardedRef,
	forwardRef,
	type MouseEventHandler,
	type ReactNode,
	type TouchEventHandler,
} from 'react';

import { withTooltip } from '#Tooltip/index.js';
import noopFn, { emptyObj } from '#utils/noops.js';

import styles from './Button.module.css';

interface ButtonProps {
	children?: ReactNode;
	disabled?: boolean;
	hidden?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	onMouseDown?: MouseEventHandler<HTMLButtonElement>;
	onTouchStart?: TouchEventHandler<HTMLButtonElement>;
}

const propagationStopper: any = (clickHandler: any = noopFn) => (event: any) => {
	event.stopPropagation();
	clickHandler?.(event);
};

/**
 * Base button component with tooltip support
 */
const BaseButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, className, hidden, onClick, theme = emptyObj, ...props }, ref) => {
		const {
			flex,
			fontFamily,
			fontWeight,
			height,
			letterSpacing,
			margin,
			padding,
			position,
			textTransform,
			whiteSpace,
			width,
		} = theme;

		// Build inline styles for dynamic properties
		const inlineStyles: CSSProperties = {
			...(flex && { flex }),
			...(fontFamily && { fontFamily }),
			...(fontWeight && { fontWeight }),
			...(height && { height }),
			...(letterSpacing && { letterSpacing }),
			...(margin && { margin }),
			...(padding && { padding }),
			...(position && { position }),
			...(textTransform && { textTransform }),
			...(whiteSpace && { whiteSpace }),
			...(width && { width }),
		};

		return (
			<button
				{...props}
				ref={ref}
				className={cx(styles.button, className)}
				data-clickable={typeof onClick === 'function' ? 'true' : 'false'}
				data-hidden={hidden ? 'true' : 'false'}
				onClick={onClick}
				style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
			>
				{children}
			</button>
		);
	},
);

BaseButtonComponent.displayName = 'BaseButton';

// Wrap with tooltip HOC
const BaseButton: any = withTooltip(BaseButtonComponent);

/**
 * Standard Button component
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, onClick, ...props }, ref?: ForwardedRef<HTMLButtonElement>) => {
		Button.displayName = 'Button';

		const forwardedRef = ref || createRef();

		return (
			<BaseButton onClick={propagationStopper(onClick)} ref={forwardedRef} {...props}>
				{children}
			</BaseButton>
		);
	},
);

/**
 * Transparent Button variant
 */
export const TransparentButton = ({
	className,
	disabled,
	onClick,
	theme = emptyObj,
	...props
}: ButtonProps) => {
	const { borderColor, fontColor, hoverFontColor } = theme;

	// Calculate hover color if needed (replicate Color manipulation from original)
	let calculatedHoverColor: string | undefined;
	if (!hoverFontColor && fontColor && fontColor !== 'inherit') {
		try {
			calculatedHoverColor = Color(fontColor).lighten(0.3).string();
		} catch {
			// If color parsing fails, don't set hover color
		}
	}

	const inlineStyles: CSSProperties & { '--hover-color'?: string } = {
		...(calculatedHoverColor && { '--hover-color': calculatedHoverColor }),
	};

	return (
		<BaseButton
			{...props}
			className={cx(styles.transparent, className, disabled && 'disabled')}
			data-disabled={disabled ? 'true' : 'false'}
			data-has-border={borderColor ? 'true' : 'false'}
			onClick={disabled ? undefined : propagationStopper(onClick)}
			style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
			theme={theme}
		/>
	);
};

export default Button;
