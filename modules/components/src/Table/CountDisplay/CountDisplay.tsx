import cx from 'classnames';
import pluralize from 'pluralize';

import { useTableContext } from '#Table/helpers/index';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import { isPlural } from './helpers';
import type { CountDisplayProps } from './types';

const CountDisplay = ({
	className: customClassName,
	style: customCSS,
	theme: { fontColor: customFontColor, fontSize: customFontSize, spacing: customSpacing } = emptyObj,
}: CountDisplayProps) => {
	const { currentPage, documentType, isLoading, pageSize, missingProvider, total } = useTableContext({
		callerName: 'Table - CountDisplay',
	});
	const {
		colors,
		components: {
			Table: {
				CountDisplay: {
					className: themeClassName,
					style: themeCSS,
					fontColor: themeFontColor = colors?.grey?.[700],
					fontSize: themeFontSize = '0.8rem',
					spacing: themeSpacing = '0.2rem',
				} = emptyObj,
				Toolbar: { spacing: themeToolbarSpacing } = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Table - CountDisplay' });

	const hasData = total > 0;

	const oneOrManyDocuments =
		missingProvider || pluralize(documentType, isPlural({ total, pageSize, currentPage }) ? 2 : 1);

	return (
		<article
			className={cx('currentlyDisplayed', customClassName, themeClassName)}
			style={{ alignItems: 'center', color: customFontColor ?? themeFontColor, display: 'flex', flexGrow: 1, fontSize: customFontSize ?? themeFontSize, ...themeCSS, ...customCSS }}
		>
			{missingProvider ? (
				<span className="noProvider">The counter is missing its {missingProvider || 'context'} provider.</span>
			) : isLoading ? (
				<span className="loading">{`Loading ${oneOrManyDocuments}...`}</span>
			) : (
				<>
					<span className="showing">Showing</span>
					{hasData ? (
						<>
							<span className="numbers">
								{`${(currentPage * pageSize + 1).toLocaleString()} - ${Math.min(
									(currentPage + 1) * pageSize,
									total,
								).toLocaleString()}`}
							</span>{' '}
							<span className="ofTotal">of {total?.toLocaleString()}</span>{' '}
						</>
					) : (
						<span className="numbers">{total}</span>
					)}
					<span className="type">{oneOrManyDocuments}</span>
				</>
			)}
		</article>
	);
};

export default CountDisplay;
