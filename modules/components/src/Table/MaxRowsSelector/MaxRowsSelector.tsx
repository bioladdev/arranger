import cx from 'classnames';
import type { ChangeEventHandler } from 'react';

import { useTableContext } from '#Table/helpers/index';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import type { MaxRowsSelectorProps } from './types';

const MaxRowsSelector = ({
	className: customClassName,
	style: customCSS,
	disabled: customDisabled,
	theme: {
		background: customBackground,
		borderColor: customBorderColor,
		borderRadius: customBorderRadius,
		fontColor: customFontColor,
		fontSize: customFontSize,
		pageSizes: customPageSizes,
	} = emptyObj,
}: MaxRowsSelectorProps) => {
	const { pageSize, setPageSize } = useTableContext({
		callerName: 'Table - MaxRowsSelector',
	});

	const {
		colors,
		components: {
			Table: {
				MaxRowsSelector: {
					background: themeBackground = colors?.common?.white,
					borderColor: themeBorderColor = colors?.grey?.[300],
					borderRadius: themeBorderRadius = '0.3rem',
					className: themeClassName,
					style: themeCSS,
					disabled: themeDisabled,
					fontColor: themeFontColor = colors?.grey?.[700],
					fontSize: themeFontSize = '0.8rem',
					pageSizes: themePageSizes = [5, 10, 20, 25, 50, 100],
					// pageSizes: themePageSizes = [5, 10, 20, 25, 50, 100, 500, 1000, 5000, 10000], // For testing purposes
					/* disabledFill: themeDisabledFill = colors?.grey?.[400],
          fill: themeFill = colors?.grey?.[600], */
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Table - MaxRowsSelector' });

	const changeHandler: ChangeEventHandler<HTMLSelectElement> = (event) => {
		setPageSize(Number(event.target.value));
	};
	const className = cx('MaxRowsSelector', customClassName, themeClassName);

	return (
		<article
			className={className}
			style={{ color: customFontColor || themeFontColor, alignItems: 'center', display: 'flex', fontSize: customFontSize || themeFontSize, ...themeCSS, ...customCSS }}
		>
			<span>Show </span>

			<select
				aria-label="Select the maximum number of rows"
				style={{ background: customBackground || themeBackground, border: `0.1rem solid ${customBorderColor || themeBorderColor}`, borderRadius: customBorderRadius || themeBorderRadius, boxSizing: 'border-box', color: customFontColor || themeFontColor, fontSize: `calc(${customFontSize || themeFontSize} * 0.9)`, height: `calc(${customFontSize || themeFontSize} * 1.5)`, margin: '0 0.1rem', padding: '0 0.2rem', textAlign: 'center' }}
				disabled={customDisabled || themeDisabled}
				onChange={changeHandler}
				value={pageSize}
			>
				{(customPageSizes || themePageSizes).map((pageSize: number) => (
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
