import { flexRender } from '@tanstack/react-table';
import cx from 'classnames';

import { TransparentButton } from '#Button/index';
import { useTableContext } from '#Table/helpers/index';
import { SELECTION_COLUMN_ID } from '#Table/types';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import type { HeaderRowProps } from './type';

const TableHeaderRow = ({
	style: customCSS,
	hasVisibleRows,
	headers,
	theme: {
		horizontalBorderColor: customHorizontalBorderColor,
		padding: customPadding,
		sortingHighlightColor: customSortingHighlightColor,
		textOverflow: customTableTextOverflow,
		verticalBorderColor: customVerticalBorderColor,
	} = emptyObj,
}: HeaderRowProps) => {
	const { allColumnsDict } = useTableContext({ callerName: 'TableHeaderrow' });
	const {
		colors,
		components: {
			Table: {
				padding: themeTablePadding = '0.1rem 0.4rem',
				textOverflow: themeTableTextOverflow = 'ellipsis',
				HeaderRow: {
					background: themeBackground,
					borderColor: themeBorderColor,
					className: themeClassName,
					style: themeCSS,
					disabledBackground: themeDisabledBackground = colors?.grey?.[100],
					disabledFontColor: themeDisabledFontColor = colors?.grey?.[500],
					fontColor: themeFontColor = colors?.grey?.[800],
					fontFamily: themeFontFamily,
					fontSize: themeFontSize = '0.9rem',
					fontWeight: themeFontWeight,
					horizontalBorderColor: themeBorderColor_horizontal = themeBorderColor,
					letterSpacing: themeLetterSpacing,
					lineHeight: themeLineHeight = '1rem',
					overflow: themeOverflow = 'hidden',
					padding: themePadding = themeTablePadding,
					position: themePosition,
					sortingHighlightColor: themeSortingHighlightColor = colors?.grey?.[500],
					textDecoration: themeTextDecoration,
					textOverflow: themeTextOverflow = themeTableTextOverflow,
					textTransform: themeTextTransform,
					verticalBorderColor: themeBorderColor_vertical = themeBorderColor,
					whiteSpace: themeWhiteSpace,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'TableHeaderRow' });

	const borderColor_horizontal = customHorizontalBorderColor || themeBorderColor_horizontal;
	const borderColor_vertical = customVerticalBorderColor || themeBorderColor_vertical;
	const headerHighlightColor = customSortingHighlightColor || themeSortingHighlightColor;
	const headerPadding = customPadding || themePadding;
	const textOverflow = customTableTextOverflow || themeTextOverflow;

	return (
		<tr
			className={cx('TableHeaderRow', themeClassName)}
			style={{ background: hasVisibleRows ? themeBackground : themeDisabledBackground, color: hasVisibleRows ? themeFontColor : themeDisabledFontColor, fontFamily: themeFontFamily, fontSize: themeFontSize, fontWeight: themeFontWeight, letterSpacing: themeLetterSpacing, lineHeight: themeLineHeight, position: themePosition, ...themeCSS, ...customCSS }}
		>
			{headers.map((headerObj) => {
				const { displayName, sortable } = allColumnsDict[headerObj.id] || {
					displayName: headerObj.id === SELECTION_COLUMN_ID ? 'Select all rows' : '',
					sortable: false,
				};

				const isSorted = headerObj.column.getIsSorted();
				const handleSorting = sortable ? headerObj.column.getToggleSortingHandler() : undefined;

				return (
					<th
						className={cx('table_header', headerObj.id, {
							asc: isSorted === 'asc',
							desc: isSorted === 'desc',
							sortable,
						})}
						style={{ overflow: themeOverflow, padding: headerPadding, position: 'relative', textAlign: 'left', textDecoration: themeTextDecoration, textOverflow: textOverflow, textTransform: themeTextTransform, whiteSpace: themeWhiteSpace, width: `${headerObj.getSize()}px` }}
						data-accessor={headerObj.id}
						data-header={displayName}
						key={headerObj.id}
						onClick={handleSorting}
						title={displayName}
					>
						{headerObj.isPlaceholder
							? null
							: flexRender(headerObj.column.columnDef.header, headerObj.getContext())}

						{headerObj.column.getCanResize() && (
							<TransparentButton
								aria-label="Resize Column"
								className={`resizer ${headerObj.column.getIsResizing() ? 'isResizing' : ''}`}
								style={{ background: 'rgba(0, 0, 0, 0.5)', cursor: 'col-resize', height: '100%', position: 'absolute', right: 0, top: 0, touchAction: 'none', userSelect: 'none', width: '3px' }}
								onMouseDown={headerObj.getResizeHandler()}
								onTouchStart={headerObj.getResizeHandler()}
							/>
						)}
					</th>
				);
			})}
		</tr>
	);
};

export default TableHeaderRow;
