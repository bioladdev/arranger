import { type CSSProperties, forwardRef } from 'react';

import type { TableThemeProps } from './types';

type TableWrapperProps = TableThemeProps['TableWrapper'] & {
	children?: React.ReactNode;
	className?: string;
};

const TableWrapper = forwardRef<HTMLElement, TableWrapperProps>(
	(
		{
			background,
			borderColor,
			borderRadius,
			boxShadow,
			children,
			className,
			flex,
			height,
			margin,
			overflow = 'auto',
			padding,
			position = 'relative',
			style: customStyle,
			width = '100%',
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			key: _key,
			...rest
		},
		ref,
	) => {
		const style: CSSProperties = {
			background,
			border: borderColor ? `1px solid ${borderColor}` : undefined,
			borderRadius,
			boxShadow,
			display: 'flex',
			flex,
			flexWrap: 'wrap',
			height,
			margin,
			overflow,
			padding,
			position,
			width,
			...customStyle,
		};

		return (
			<section
				className={className}
				ref={ref}
				style={style}
				{...rest}
			>
				{children}
			</section>
		);
	},
);

export default TableWrapper;
