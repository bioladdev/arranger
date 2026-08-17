import cx from 'classnames';

import { ColumnListStyles, SELECTION_COLUMN_ID } from '#Table/types';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import styles from './Cell.module.css';
import type { CellProps } from './types';

const Cell = ({
	accessor = '',
	children,
	colSpan,
	style: customCSS,
	size: columnWidth,
	theme: {
		background: customBackground,
		borderColor: customBorderColor,
		horizontalBorderColor: customHorizontalBorderColor,
		hoverBackground: customHoverBackground,
		hoverHorizontalBorderColor: customHoverHorizontalBorderColor,
		hoverVerticalBorderColor: customHoverVerticalBorderColor,
		padding: customPadding,
		textOverflow: customTextOverflow,
		verticalBorderColor: customVerticalBorderColor,
	} = emptyObj,
	value,
}: CellProps) => {
	const {
		components: {
			Table: {
				padding: themeTablePadding,
				textOverflow: themeTableTextOverflow,

				// components
				columnTypes: { list: { listStyle: themeListStyle } = emptyObj, ...otherThemeColumnTypes } = emptyObj,
				Cell: {
					background: themeBackground,
					borderColor: themeBorderColor,
					className: themeClassName,
					style: themeCSS,
					fontColor: themeFontColor,
					horizontalBorderColor: themeHorizontalBorderColor,
					hoverBackground: themeHoverBackground,
					hoverBorderColor: themeHoverBorderColor,
					hoverFontColor: themeHoverFontColor,
					hoverHorizontalBorderColor: themeHoverHorizontalBorderColor,
					hoverVerticalBorderColor: themeHoverVerticalBorderColor,
					overflow: themeOverflow,
					padding: themePadding = themeTablePadding,
					textDecoration: themeTextDecoration,
					textOverflow: themeTextOverflow = themeTableTextOverflow,
					textTransform: themeTextTransform,
					verticalBorderColor: themeVerticalBorderColor,
					whiteSpace: themeWhiteSpace,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Table - Cell' });

	const background = customBackground || themeBackground;
	const horizontalBorderColor =
		customHorizontalBorderColor || themeHorizontalBorderColor || customBorderColor || themeBorderColor;
	const verticalBorderColor =
		customVerticalBorderColor || themeVerticalBorderColor || customBorderColor || themeBorderColor;
	const hoverBackground = customHoverBackground || themeHoverBackground;
	const hoverHorizontalBorderColor =
		customHoverHorizontalBorderColor || themeHoverHorizontalBorderColor || themeHoverBorderColor;
	const hoverVerticalBorderColor =
		customHoverVerticalBorderColor || themeHoverVerticalBorderColor || themeHoverBorderColor;
	const padding = customPadding || themePadding;
	const textOverflow = customTextOverflow || themeTextOverflow;

	const { listStyle = themeListStyle } = otherThemeColumnTypes[accessor] || emptyObj;

	const themeStyle = {
		'--arranger-cell-background': background,
		'--arranger-cell-font-color': themeFontColor,
		'--arranger-cell-horizontal-border-color': horizontalBorderColor,
		'--arranger-cell-hover-background': hoverBackground,
		'--arranger-cell-hover-font-color': themeHoverFontColor,
		'--arranger-cell-hover-horizontal-border-color': hoverHorizontalBorderColor,
		'--arranger-cell-hover-vertical-border-color': hoverVerticalBorderColor,
		'--arranger-cell-overflow': themeOverflow,
		'--arranger-cell-padding': padding,
		'--arranger-cell-text-decoration': themeTextDecoration,
		'--arranger-cell-text-overflow': textOverflow,
		'--arranger-cell-text-transform': themeTextTransform,
		'--arranger-cell-vertical-border-color': verticalBorderColor,
		'--arranger-cell-white-space': themeWhiteSpace,
		'--arranger-cell-width': columnWidth,
	};

	return (
		<td
			className={cx(styles.cell, themeClassName)}
			colSpan={colSpan}
			style={{ ...themeStyle, ...themeCSS, ...customCSS }}
			data-accessor={accessor}
			data-value={value}
			title={accessor === SELECTION_COLUMN_ID ? 'Select this row' : value}
		>
			{children}
		</td>
	);
};

export default Cell;
