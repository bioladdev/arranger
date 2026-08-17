import cx from 'classnames';
import { merge } from 'lodash-es';
import { useMemo } from 'react';

import ColumnSelectButton from '#Table/ColumnsSelectButton/index';
import CountDisplay from '#Table/CountDisplay/index';
import DownloadButton from '#Table/DownloadButton/index';
import { useThemeContext } from '#ThemeContext/index';
import getDisplayName from '#utils/getComponentDisplayName';
import { emptyObj } from '#utils/noops';

import styles from './Toolbar.module.css';
import type { ToolbarProps } from './types';

const Toolbar = ({
	style: customCSS,
	className: customClassName,
	theme: { CountDisplay: customCountDisplayProps, spacing: customSpacing, tools: customTools } = emptyObj,
}: ToolbarProps) => {
	const {
		components: {
			Table: {
				Toolbar: {
					className: themeClassName,
					style: themeCSS,
					CountDisplay: themeCountDisplayProps = emptyObj,
					spacing: themeSpacing = '0.4rem',
					tools: themeTools = [ColumnSelectButton, DownloadButton],
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Table - Toolbar' });
	const tools = customTools ?? themeTools;
	const className = cx('Toolbar', customClassName, themeClassName);
	const countDisplayTheme = merge({}, themeCountDisplayProps, customCountDisplayProps);

	return useMemo(
		() => (
			<section
				className={className}
				style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between', ...themeCSS, ...customCSS }}
			>
				<CountDisplay className={styles.countDisplay} />

				<ul
					className="tools"
					style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', listStyle: 'none', margin: '0 0 -0.3rem 0.7rem', padding: 0 }}
				>
					{tools.map((Component, index) => (
						<li
							style={{ marginLeft: customSpacing ?? themeSpacing, marginBottom: '0.3rem' }}
							key={`${getDisplayName(Component)}-${index}`}
						>
							<Component />
						</li>
					))}
				</ul>
			</section>
		),
		[className, countDisplayTheme, customCSS, customSpacing, themeCSS, themeSpacing, tools],
	);
};

export default Toolbar;
