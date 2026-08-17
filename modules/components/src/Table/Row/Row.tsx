import { flexRender } from '@tanstack/react-table';
import cx from 'classnames';

import MetaMorphicChild from '#MetaMorphicChild/index';
import { getDisplayValue } from '#Table/helpers/index';
import { SELECTION_COLUMN_ID } from '#Table/types';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import Cell from './Cell';
import styles from './Row.module.css';
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
					hoverBackground: themeHoverBackground,
					hoverBorderColor: themeHoverBorderColor,
					hoverFontColor: themeHoverFontColor,
					letterSpacing: themeLetterSpacing,
					lineHeight: themeLineHeight,
					position: themePosition,
					selectedBackground: themeSelectedBackground,
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
	const hoverBorderColor =
		customHoverVerticalBorderColor || customHoverHorizontalBorderColor || themeHoverBorderColor;

	const themeStyle = {
		'--arranger-row-background': themeBackground,
		'--arranger-row-font-color': themeFontColor,
		'--arranger-row-font-family': themeFontFamily,
		'--arranger-row-font-size': themeFontSize,
		'--arranger-row-font-weight': themeFontWeight,
		'--arranger-row-hover-background': hoverBackground,
		'--arranger-row-hover-border-color': hoverBorderColor,
		'--arranger-row-hover-font-color': themeHoverFontColor,
		'--arranger-row-letter-spacing': themeLetterSpacing,
		'--arranger-row-line-height': themeLineHeight,
		'--arranger-row-position': themePosition,
		'--arranger-row-selected-background': themeSelectedBackground,
		'--arranger-row-selected-font-color': themeSelectedFontColor,
		'--arranger-row-text-overflow': textOverflow,
		'--arranger-row-vertical-border-color': themeVerticalBorderColor,
	};

	return (
		<tr
			className={cx(styles.row, themeClassName)}
			data-selected={Boolean(selected)}
			style={{ ...themeStyle, ...themeCSS, ...customCSS }}
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
