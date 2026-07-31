import cx from 'classnames';

import { ColumnListStyles, SELECTION_COLUMN_ID } from '#Table/types';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

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
		colors,
		components: {
			Table: {
				padding: themeTablePadding = '0.1rem 0.4rem',
				textOverflow: themeTableTextOverflow = 'ellipsis',

				// components
				columnTypes: { list: { listStyle: themeListStyle } = emptyObj, ...otherThemeColumnTypes } = emptyObj,
				Cell: {
					background: themeBackground,
					borderColor: themeBorderColor = 'transparent',
					className: themeClassName,
					style: themeCSS,
					fontColor: themeFontColor,
					horizontalBorderColor: themeHorizontalBorderColor,
					hoverBackground: themeHoverBackground = colors?.grey?.[300],
					hoverBorderColor: themeHoverBorderColor,
					hoverFontColor: themeHoverFontColor,
					hoverHorizontalBorderColor: themeHoverHorizontalBorderColor,
					hoverVerticalBorderColor: themeHoverVerticalBorderColor,
					overflow: themeOverflow = 'hidden',
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

	return (
		<td
			className={cx('cell', themeClassName)}
			colSpan={colSpan}
			style={{ background, borderBottomColor: horizontalBorderColor, borderLeftColor: verticalBorderColor, borderRightColor: verticalBorderColor, borderTopColor: horizontalBorderColor, borderStyle: 'solid', borderWidth: '1px', boxSizing: 'border-box', color: themeFontColor, overflow: themeOverflow, padding, position: 'relative', textAlign: 'left', textDecoration: themeTextDecoration, textOverflow: textOverflow, textTransform: themeTextTransform, verticalAlign: 'top', whiteSpace: themeWhiteSpace, width: columnWidth, ...themeCSS, ...customCSS }}
			data-accessor={accessor}
			data-value={value}
			title={accessor === SELECTION_COLUMN_ID ? 'Select this row' : value}
		>
			{children}
		</td>
	);
};

export default Cell;
