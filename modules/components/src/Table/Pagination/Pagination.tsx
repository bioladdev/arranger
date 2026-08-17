import cx from 'classnames';
import { merge } from 'lodash-es';
import { useMemo } from 'react';

import MaxRowsSelector from '#Table/MaxRowsSelector/index';
import PageSelector from '#Table/PageSelector/index';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import styles from './Pagination.module.css';
import type { PaginationProps } from './types';

const Pagination = ({
	className: customClassName,
	style: customCSS,
	theme: { MaxRowSelector: customMaxRowSelectorProps, PageSelector: customPageSelectorProps } = emptyObj,
}: PaginationProps) => {
	const {
		components: {
			Table: {
				Pagination: {
					className: themeClassName,
					style: themeCSS,
					MaxRowsSelector: themeMaxRowsSelectorProps = emptyObj,
					PageSelector: themePageSelectorProps = emptyObj,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Table - Pagination' });
	const className = cx('Pagination', customClassName, themeClassName);
	const maxRowsSelectorTheme = merge({}, themeMaxRowsSelectorProps, customMaxRowSelectorProps);
	const pageSelectorTheme = merge({}, themePageSelectorProps, customPageSelectorProps);

	return useMemo(
		() => (
			<section
				className={className}
				style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between', ...themeCSS, ...customCSS }}
			>
				{/* TODO: restore pseudo-selector styles via CSS */}
				<MaxRowsSelector className={styles.maxRowsSelector} />

				<PageSelector theme={pageSelectorTheme} />
			</section>
		),
		[className, customCSS, maxRowsSelectorTheme, pageSelectorTheme, themeCSS],
	);
};

export default Pagination;
