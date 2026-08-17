import { flexRender } from '@tanstack/react-table';
import cx from 'classnames';

import { TransparentButton } from '#Button/index';
import { useTableContext } from '#Table/helpers/index';
import { SELECTION_COLUMN_ID } from '#Table/types';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import styles from './HeaderRow.module.css';
import type { HeaderRowProps } from './type';

const TableHeaderRow = ({
	style: customCSS,
	hasVisibleRows,
	headers,
	theme: {
		padding: customPadding,
		sortingHighlightColor: customSortingHighlightColor,
		textOverflow: customTableTextOverflow,
	} = emptyObj,
}: HeaderRowProps) => {
	const { allColumnsDict } = useTableContext({ callerName: 'TableHeaderrow' });
	const {
		components: {
			Table: {
				padding: themeTablePadding,
				textOverflow: themeTableTextOverflow,
				HeaderRow: {
					background: themeBackground,
					className: themeClassName,
					style: themeCSS,
					disabledBackground: themeDisabledBackground,
					disabledFontColor: themeDisabledFontColor,
					fontColor: themeFontColor,
					fontFamily: themeFontFamily,
					fontSize: themeFontSize,
					fontWeight: themeFontWeight,
					letterSpacing: themeLetterSpacing,
					lineHeight: themeLineHeight,
					overflow: themeOverflow,
					padding: themePadding = themeTablePadding,
					position: themePosition,
					sortingHighlightColor: themeSortingHighlightColor,
					textDecoration: themeTextDecoration,
					textOverflow: themeTextOverflow = themeTableTextOverflow,
					textTransform: themeTextTransform,
					whiteSpace: themeWhiteSpace,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'TableHeaderRow' });

	const headerHighlightColor = customSortingHighlightColor || themeSortingHighlightColor;
	const headerPadding = customPadding || themePadding;
	const textOverflow = customTableTextOverflow || themeTextOverflow;

	const rowThemeStyle = {
		'--arranger-header-row-background': themeBackground,
		'--arranger-header-row-disabled-background': themeDisabledBackground,
		'--arranger-header-row-disabled-font-color': themeDisabledFontColor,
		'--arranger-header-row-font-color': themeFontColor,
		'--arranger-header-row-font-family': themeFontFamily,
		'--arranger-header-row-font-size': themeFontSize,
		'--arranger-header-row-font-weight': themeFontWeight,
		'--arranger-header-row-letter-spacing': themeLetterSpacing,
		'--arranger-header-row-line-height': themeLineHeight,
		'--arranger-header-row-position': themePosition,
	};

	return (
		<tr
			className={cx(styles.headerRow, themeClassName)}
			data-has-visible-rows={Boolean(hasVisibleRows)}
			style={{ ...rowThemeStyle, ...themeCSS, ...customCSS }}
		>
			{headers.map((headerObj) => {
				const { displayName, sortable } = allColumnsDict[headerObj.id] || {
					displayName: headerObj.id === SELECTION_COLUMN_ID ? 'Select all rows' : '',
					sortable: false,
				};

				const isSorted = headerObj.column.getIsSorted();
				const handleSorting = sortable ? headerObj.column.getToggleSortingHandler() : undefined;

				const headerThemeStyle = {
					'--arranger-header-row-overflow': themeOverflow,
					'--arranger-header-row-padding': headerPadding,
					'--arranger-header-row-sorting-highlight-color': headerHighlightColor,
					'--arranger-header-row-text-decoration': themeTextDecoration,
					'--arranger-header-row-text-overflow': textOverflow,
					'--arranger-header-row-text-transform': themeTextTransform,
					'--arranger-header-row-white-space': themeWhiteSpace,
				};

				return (
					<th
						className={styles.header}
						data-accessor={headerObj.id}
						data-header={displayName}
						data-sortable={sortable}
						data-sorted={isSorted || undefined}
						style={{ ...headerThemeStyle, width: `${headerObj.getSize()}px` }}
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
								className={styles.resizer}
								data-resizing={headerObj.column.getIsResizing()}
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
