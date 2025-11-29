import React, { type ReactNode } from 'react';

interface OptionProps {
	value?: string | number;
	children?: ReactNode;
}

export const Option = ({ value, children, ...props }: OptionProps) => (
	<option value={value} {...props}>
		{children}
	</option>
);

interface SelectProps {
	children?: ReactNode;
}

const Select = ({ children, ...props }: SelectProps) => <select {...props}>{children}</select>;

export default Select;
