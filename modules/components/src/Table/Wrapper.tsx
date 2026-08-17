import cx from 'classnames';
import { forwardRef } from 'react';

import type { TableThemeProps } from './types';
import styles from './Wrapper.module.css';

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
			overflow,
			padding,
			position,
			style: customStyle,
			width,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			key: _key,
			...rest
		},
		ref,
	) => {
		const themeStyle = {
			'--arranger-table-wrapper-background': background,
			'--arranger-table-wrapper-border': borderColor ? `1px solid ${borderColor}` : undefined,
			'--arranger-table-wrapper-border-radius': borderRadius,
			'--arranger-table-wrapper-box-shadow': boxShadow,
			'--arranger-table-wrapper-flex': flex,
			'--arranger-table-wrapper-height': height,
			'--arranger-table-wrapper-margin': margin,
			'--arranger-table-wrapper-overflow': overflow,
			'--arranger-table-wrapper-padding': padding,
			'--arranger-table-wrapper-position': position,
			'--arranger-table-wrapper-width': width,
		};

		return (
			<section
				className={cx(styles.wrapper, className)}
				ref={ref}
				style={{ ...themeStyle, ...customStyle }}
				{...rest}
			>
				{children}
			</section>
		);
	},
);

export default TableWrapper;
