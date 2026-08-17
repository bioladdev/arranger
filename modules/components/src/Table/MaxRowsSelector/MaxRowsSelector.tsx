import cx from 'classnames';
import type { ChangeEventHandler } from 'react';

import { useTableContext } from '#Table/helpers/index';

import styles from './MaxRowsSelector.module.css';
import type { MaxRowsSelectorProps } from './types';

const DEFAULT_PAGE_SIZES = [5, 10, 20, 25, 50, 100];

const MaxRowsSelector = ({ disabled, pageSizes = DEFAULT_PAGE_SIZES, className }: MaxRowsSelectorProps) => {
	const { pageSize, setPageSize } = useTableContext({
		callerName: 'Table - MaxRowsSelector',
	});

	const changeHandler: ChangeEventHandler<HTMLSelectElement> = (event) => {
		setPageSize(Number(event.target.value));
	};

	return (
		<article className={cx(styles.maxRowsSelector, className)}>
			<span>Show </span>

			<select
				aria-label="Select the maximum number of rows"
				className={styles.select}
				disabled={disabled}
				onChange={changeHandler}
				value={pageSize}
			>
				{pageSizes.map((pageSize: number) => (
					<option
						key={pageSize}
						value={pageSize}
					>
						{pageSize}
					</option>
				))}
			</select>

			<span> rows</span>
		</article>
	);
};

export default MaxRowsSelector;
