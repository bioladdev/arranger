import cx from 'classnames';

import TextHighlight from '#TextHighlight/index';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import styles from './QuickSearchDropdown.module.css';

const entityColorClasses = {
	1: styles.resultEntity1,
	2: styles.resultEntity2,
	3: styles.resultEntity3,
	4: styles.resultEntity4,
	5: styles.resultEntity5,
};

const QuickSearchDropdownItem = ({ entityName, inputValue, onMouseDown, optionIndex, primaryKey, result }) => {
	const {
		components: {
			QuickSearch: {
				DropDownItems: {
					entityLogo: {
						borderRadius: themeEntityLogoBorderRadius,
						style: themeEntityLogoCSS = emptyObj,
						enabled: themeEntityLogoEnabled = true,
						margin: themeEntityLogoMargin,
						width: themeEntityLogoWidth,
					} = emptyObj,
					lineHeight: themeDropdownItemsLineHeight,
					resultKeyText: {
						style: themeResultKeyTextCSS = emptyObj,
						fontSize: themeResultKeyTextFontSize,
					} = emptyObj,
					resultValue: { style: themeResultValueCSS = emptyObj, fontSize: themeResultValueFontSize } = emptyObj,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'QuickSearch' });

	const entityThemeStyle = {
		'--arranger-qs-entity-border-radius': themeEntityLogoBorderRadius,
		'--arranger-qs-entity-margin': themeEntityLogoMargin,
		'--arranger-qs-entity-width': themeEntityLogoWidth,
	};

	/** @type {import('react').CSSProperties & Record<`--arranger-qs-${string}`, string | undefined>} */
	const detailsThemeStyle = {
		'--arranger-qs-dropdown-line-height': themeDropdownItemsLineHeight,
		'--arranger-qs-result-key-font-size': themeResultKeyTextFontSize,
		'--arranger-qs-result-value-font-size': themeResultValueFontSize,
	};

	return (
		<div
			className={styles.result}
			data-clickable={Boolean(onMouseDown)}
			onMouseDown={onMouseDown}
			role="presentation"
			title={primaryKey}
		>
			{themeEntityLogoEnabled && (
				<div
					className={cx(styles.resultEntity, entityColorClasses[optionIndex])}
					style={{ ...entityThemeStyle, ...themeEntityLogoCSS }}
				>
					<div>{entityName.slice(0, 2).toUpperCase()}</div>
				</div>
			)}

			<div
				className={styles.resultDetails}
				style={detailsThemeStyle}
			>
				<div
					className={styles.resultKey}
					style={{ ...detailsThemeStyle, ...themeResultKeyTextCSS }}
				>
					<TextHighlight highlightText={inputValue} content={primaryKey} />
				</div>

				{primaryKey === result || (
					<div
						className={styles.resultValue}
						style={{ ...detailsThemeStyle, ...themeResultValueCSS }}
					>
						<TextHighlight highlightText={inputValue} content={result} />
					</div>
				)}
			</div>
		</div>
	);
};

export default QuickSearchDropdownItem;
