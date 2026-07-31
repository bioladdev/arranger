import { flexRender } from '@tanstack/react-table';
import cx from 'classnames';

import MetaMorphicChild from '#MetaMorphicChild/index';
import { getDisplayValue } from '#Table/helpers/index';
import { SELECTION_COLUMN_ID } from '#Table/types';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import Cell from './Cell';
import type { RowProps } from './types';

const TableRow = ({
	style: customCSS,
	id,
	theme: {
		borderColor: customBorderColor,
		hoverBackground: customHoverBackground,
		hoverHorizontalBorderColor: customHoverHorizontalBorderColor,
		hoverVerticalBorderColor: customHoverVerticalBorderColor,
		textOverflow: customTextOverflow,
	} = emptyObj,
	...props
}: RowProps) => {
	const {
		colors,
		components: {
			Table: {
				noDataMessage = 'No data matches the search parameters.',

				// components
				Row: {
					background: themeBackground,
					borderColor: themeBorderColor = customBorderColor,
					className: themeClassName,
					style: themeCSS,
					fontColor: themeFontColor,
					fontFamily: themeFontFamily,
					fontSize: themeFontSize,
					fontWeight: themeFontWeight,
					horizontalBorderColor: themeHorizontalBorderColor = themeBorderColor,
					hoverBackground: themeHoverBackground = colors?.grey?.[100],
					hoverBorderColor: themeHoverBorderColor,
					hoverFontColor: themeHoverFontColor,
					hoverHorizontalBorderColor: themeHoverHorizontalBorderColor,
					hoverVerticalBorderColor: themeHoverVerticalBorderColor,
					letterSpacing: themeLetterSpacing,
					lineHeight: themeLineHeight,
					position: themePosition,
					selectedBackground: themeSelectedBackground = colors?.grey?.[300],
					selectedFontColor: themeSelectedFontColor,
					textOverflow: themeTextOverflow,
					verticalBorderColor: themeVerticalBorderColor = themeBorderColor,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Table - Row' });

	const selected = props?.getIsSelected?.();
	const textOverflow = customTextOverflow || themeTextOverflow;
	const visibleCells = props?.getVisibleCells?.();
	const hasVisibleCells = visibleCells && visibleCells.length > 0;

	const hoverBackground = customHoverBackground || themeHoverBackground;
	const hoverHorizontalBorderColor =
		customHoverHorizontalBorderColor || themeHoverHorizontalBorderColor || themeHoverBorderColor;
	const hoverVerticalBorderColor =
		customHoverVerticalBorderColor || themeHoverVerticalBorderColor || themeHoverBorderColor;

	return (
		<tr
			className={cx('Row', themeClassName, { selected })}
			style={{ background: themeBackground, borderLeft: themeVerticalBorderColor ? `0.1rem solid ${themeVerticalBorderColor}` : undefined, borderRight: themeVerticalBorderColor ? `0.1rem solid ${themeVerticalBorderColor}` : undefined, color: themeFontColor, fontFamily: themeFontFamily, fontSize: themeFontSize, fontWeight: themeFontWeight, letterSpacing: themeLetterSpacing, lineHeight: themeLineHeight, position: themePosition, textOverflow: textOverflow, ...themeCSS, ...customCSS }}
			data-row-id={id}
		>
			{hasVisibleCells ? (
				visibleCells?.map((cellObj) => {
					const accessor = cellObj.column.id;
					const value =
						accessor === SELECTION_COLUMN_ID
							? `${selected}`
							: getDisplayValue(cellObj?.row?.original, cellObj.column.columnDef);

					return (
						<Cell
							accessor={accessor}
							key={cellObj.id}
							size={`${cellObj.column.getSize()}px`}
							value={value}
						>
							{flexRender(cellObj.column.columnDef.cell, cellObj.getContext())}
						</Cell>
					);
				})
			) : (
				<Cell colSpan={100}>
					<MetaMorphicChild>{noDataMessage}</MetaMorphicChild>
				</Cell>
			)}
		</tr>
	);
};

export default TableRow;
