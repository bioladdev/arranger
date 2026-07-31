import { type ComponentType, forwardRef } from 'react';

import StyledTooltip from './StyledTooltip';

const withTooltip = <Props extends object>(Component: ComponentType<Props>) => {
	const Tooltipped = forwardRef<unknown, Props>((props, ref) => (
		<StyledTooltip>
			<Component ref={ref} {...props} />
		</StyledTooltip>
	));
	Tooltipped.displayName = `Tooltipped(${(Component as { displayName?: string }).displayName ?? (Component as { name?: string }).name ?? 'Component'})`;
	return Tooltipped;
};

export const TooltippedForm = forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement> & { theme?: Record<string, unknown> }>(
	({ theme, ...props }, ref) => (
		<StyledTooltip theme={theme}>
			<form ref={ref} {...props} />
		</StyledTooltip>
	),
);
TooltippedForm.displayName = 'TooltippedForm';

export const TooltippedInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { theme?: Record<string, unknown> }>(
	({ theme, ...props }, ref) => (
		<StyledTooltip theme={theme}>
			<input ref={ref} {...props} />
		</StyledTooltip>
	),
);
TooltippedInput.displayName = 'TooltippedInput';

export const TooltippedLI = forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement> & { theme?: Record<string, unknown> }>(
	({ theme, ...props }, ref) => (
		<StyledTooltip theme={theme}>
			<li ref={ref} {...props} />
		</StyledTooltip>
	),
);
TooltippedLI.displayName = 'TooltippedLI';

export default withTooltip;
