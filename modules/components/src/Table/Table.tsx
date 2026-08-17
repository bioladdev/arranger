import cx from 'classnames';
import { type PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';

import Spinner, { LoaderContainer } from '#Loader/index';
import MetaMorphicChild from '#MetaMorphicChild/index';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import HeaderRow from './HeaderRow/index';
import { useTableData } from './helpers/index';
import Row from './Row/index';
import styles from './Table.module.css';
import type { TableProps } from './types';
import TableWrapper from './Wrapper';

const Table = ({
	className: customClassName,
	disableRowSelection = false,
	theme: { columnTypes, hideLoader: customHideLoader } = emptyObj,
}: TableProps) => {
	const ref = useRef<HTMLElement>(null);
	const [visibleTableWidth, setVisibleTableWidth] = useState(0);
	const { hasShowableColumns, hasVisibleColumns, isLoading, missingProvider, tableInstance } = useTableData({
		columnTypes,
		disableRowSelection,
		visibleTableWidth,
	});
	const {
		components: {
			Table: {
				// functionality
				errorMessage = 'The table failed to load. Please try again later.',
				hideLoader: themeHideLoader,
				loadingMessage = 'Loading table data...',
				noColumnsMessage = 'No columns to display.',

				// appearance
				background: themeTableBackground,
				borderColor: themeTableBorderColor,
				style: themeTableCSS,
				fontColor: themeTableFontColor,
				fontFamily: themeTableFontFamily,
				fontSize: themeTableFontSize,
				fontWeight: themeTableFontWeight,
				letterSpacing: themeTableLetterSpacing,
				lineHeight: themeTableLineHeight,
				margin: themeTableMargin,
				textDecoration: themeTableTextDecoration,
				textTransform: themeTableTextTransform,
				whiteSpace: themeTableWhiteSpace,

				// Child Components
				HeaderGroup: {
					background: themeHeaderGroupBackground,
					borderColor: themeHeaderGroupBorderColor = themeTableBorderColor,
					className: themeHeaderGroupClassName,
					style: themeHeaderGroupCSS,
					margin: themeHeaderGroupMargin,
					overflow: themeHeaderGroupOverflow,
					position: themeHeaderGroupPosition,
				} = emptyObj,
				TableBody: {
					background: themeTableBodyBackground,
					borderColor: themeTableBodyBorderColor = themeTableBorderColor,
					className: themeTableBodyClassName,
					style: themeTableBodyCSS,
					margin: themeTableBodyMargin,
					overflow: themeTableBodyOverflow,
					position: themeTableBodyPosition,
				} = emptyObj,
				TableWrapper: {
					className: themeTableWrapperClassName,
					style: themeTableWrapperCSS,
					key: themeTableWrapperKey = 'ArrangerTableWrapper',
					...themeTableWrapperProps
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Table' });

	const hideLoader = customHideLoader || themeHideLoader;
	const headerGroups = tableInstance.getHeaderGroups();
	const rows = tableInstance.getRowModel().rows;
	const hasVisibleRows = rows.length > 0;

	// shared across .table and MessageContainer via CSS custom-property inheritance from TableWrapper
	const tableThemeStyle = {
		'--arranger-table-background': themeTableBackground,
		'--arranger-table-font-color': themeTableFontColor,
		'--arranger-table-font-family': themeTableFontFamily,
		'--arranger-table-font-size': themeTableFontSize,
		'--arranger-table-font-weight': themeTableFontWeight,
		'--arranger-table-letter-spacing': themeTableLetterSpacing,
		'--arranger-table-line-height': themeTableLineHeight,
		'--arranger-table-text-decoration': themeTableTextDecoration,
		'--arranger-table-text-transform': themeTableTextTransform,
		'--arranger-table-white-space': themeTableWhiteSpace,
		'--arranger-header-group-border-color': themeHeaderGroupBorderColor,
	};

	const MessageContainer = ({ Component = 'figure', children }: PropsWithChildren<any>) => (
		<Component className={styles.messageContainer}>
			<MetaMorphicChild>{children}</MetaMorphicChild>
		</Component>
	);

	useLayoutEffect(() => {
		const { width } = ref?.current?.getBoundingClientRect?.() || { width: 0 };
		setVisibleTableWidth(width);
	}, []);

	return (
		<TableWrapper
			className={cx('TableWrapper', customClassName, themeTableWrapperClassName)}
			style={{ ...tableThemeStyle, ...themeTableWrapperCSS }}
			key={themeTableWrapperKey}
			margin={themeTableMargin}
			ref={ref}
			{...themeTableWrapperProps}
		>
			{missingProvider ? (
				<MessageContainer>This table is missing its {missingProvider || 'context'} provider.</MessageContainer>
			) : // ) : isLoading ? (
			// 	hideLoader ? null : (
			// 		<Spinner
			// 			css={[
			// 				css`
			// 					border: 1px solid ${themeHeaderGroupBorderColor};
			// 					padding: 1rem;
			// 				`,
			// 				containerStyles,
			// 			]}
			// 			theme={{ vertical: true }}
			// 		>
			// 			{loadingMessage}
			// 		</Spinner>
			// 	)
			hasShowableColumns ? (
				hasVisibleColumns ? (
					<LoaderContainer {...{ isLoading }}>
						<table
							className={styles.table}
							style={themeTableCSS}
						>
							<thead
								className={cx(styles.headerGroup, themeHeaderGroupClassName)}
								style={{
									'--arranger-header-group-background': themeHeaderGroupBackground,
									'--arranger-header-group-border': themeHeaderGroupBorderColor
										? `1px solid ${themeHeaderGroupBorderColor}`
										: undefined,
									'--arranger-header-group-margin': themeHeaderGroupMargin,
									'--arranger-header-group-overflow': themeHeaderGroupOverflow,
									'--arranger-header-group-position': themeHeaderGroupPosition,
									...themeHeaderGroupCSS,
								}}
							>
								{headerGroups.map((headerGroup) => (
									<HeaderRow
										hasVisibleRows={hasVisibleRows}
										key={headerGroup.id}
										{...headerGroup}
									/>
								))}
							</thead>

							<tbody
								className={cx(styles.tableBody, themeTableBodyClassName)}
								style={{
									'--arranger-table-body-background': themeTableBodyBackground,
									'--arranger-table-body-border': themeTableBodyBorderColor
										? `1px solid ${themeTableBodyBorderColor}`
										: undefined,
									'--arranger-table-body-margin': themeTableBodyMargin,
									'--arranger-table-body-overflow': themeTableBodyOverflow,
									'--arranger-table-body-position': themeTableBodyPosition,
									...themeTableBodyCSS,
								}}
							>
								{hasVisibleRows ? (
									rows.map((row) => (
										<Row
											key={row.id}
											{...row}
										/>
									))
								) : (
									// Reuse Row + Cell to display "no data" message
									<Row />
								)}
							</tbody>
						</table>
					</LoaderContainer>
				) : (
					<MessageContainer>{noColumnsMessage}</MessageContainer>
				)
			) : (
				<MessageContainer>{errorMessage}</MessageContainer>
			)}
		</TableWrapper>
	);
};

export default Table;
