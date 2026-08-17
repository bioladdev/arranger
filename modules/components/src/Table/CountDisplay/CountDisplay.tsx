import cx from 'classnames';
import pluralize from 'pluralize';

import { useTableContext } from '#Table/helpers/index';

import styles from './CountDisplay.module.css';
import { isPlural } from './helpers.js';
import type { CountDisplayProps } from './types';

const CountDisplay = ({ className }: CountDisplayProps) => {
	const { currentPage, documentType, isLoading, pageSize, missingProvider, total } = useTableContext({
		callerName: 'Table - CountDisplay',
	});

	const hasData = total > 0;

	const oneOrManyDocuments =
		missingProvider || pluralize(documentType, isPlural({ total, pageSize, currentPage }) ? 2 : 1);

	return (
		<article className={cx(styles.countDisplay, className)}>
			{missingProvider ? (
				<span>The counter is missing its {missingProvider || 'context'} provider.</span>
			) : isLoading ? (
				<span>{`Loading ${oneOrManyDocuments}...`}</span>
			) : (
				<>
					<span>Showing</span>
					{hasData ? (
						<>
							<span>
								{`${(currentPage * pageSize + 1).toLocaleString()} - ${Math.min(
									(currentPage + 1) * pageSize,
									total,
								).toLocaleString()}`}
							</span>{' '}
							<span>of {total?.toLocaleString()}</span>{' '}
						</>
					) : (
						<span>{total}</span>
					)}
					<span>{oneOrManyDocuments}</span>
				</>
			)}
		</article>
	);
};

export default CountDisplay;
