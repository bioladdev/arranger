import { type CSSProperties, type ElementType, forwardRef } from 'react';

import type TooltipProps from './types';

/**
 * Tooltip wrapper. The CSS pseudo-element tooltip is no longer generated dynamically;
 * the `tooltipText` and `tooltipAlign` theme props are retained on the element as
 * data attributes for any downstream CSS to pick up.
 */
const StyledTooltip = forwardRef<HTMLDivElement, TooltipProps & { style?: CSSProperties; className?: string }>(
	({ children, style, className, theme, ...rest }, ref) => (
		<div
			className={className}
			data-tooltip-align={theme?.tooltipAlign}
			data-tooltip-text={theme?.tooltipText}
			data-tooltip-visibility={theme?.tooltipVisibility}
			ref={ref}
			style={{ position: 'relative', ...style }}
			{...rest}
		>
			{children}
		</div>
	),
);

StyledTooltip.displayName = 'StyledTooltip';

export default StyledTooltip;
