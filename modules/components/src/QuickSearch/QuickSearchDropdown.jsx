import TextHighlight from '#TextHighlight/index';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

const QuickSearchDropdownItem = ({ entityName, inputValue, onMouseDown, optionIndex, primaryKey, result }) => {
	const {
		components: {
			QuickSearch: {
				DropDownItems: {
					entityLogo: {
						borderRadius: themeEntityLogoBorderRadius = '50%',
						color1: themeEntityLogoColor1 = '#a42c90',
						color2: themeEntityLogoColor2 = '#00afed',
						color3: themeEntityLogoColor3 = '#ff9324',
						color4: themeEntityLogoColor4 = '#009bb8',
						color5: themeEntityLogoColor5 = '#d8202f',
						style: themeEntityLogoCSS = emptyObj,
						enabled: themeEntityLogoEnabled = true,
						margin: themeEntityLogoMargin = '6px',
						width: themeEntityLogoWidth = '14%',
					} = emptyObj,
					evenRowColor: themeDropDownItemsEvenRowColor = '#f4f5f8',
					lineHeight: themeDropdownItemsLineHeight = '220%',
					resultKeyText: {
						style: themeResultKeyTextCSS = emptyObj,
						fontSize: themeResultKeyTextFontSize = '0.9em',
					} = emptyObj,
					resultValue: { style: themeResultValueCSS = emptyObj, fontSize: themeResultValueFontSize = '0.7em' } = emptyObj,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'QuickSearch' });

	const logoEntityColors = {
		1: themeEntityLogoColor1,
		2: themeEntityLogoColor2,
		3: themeEntityLogoColor3,
		4: themeEntityLogoColor4,
		5: themeEntityLogoColor5,
	};

	return (
		<div
			className="quick-search-result"
			style={onMouseDown ? { cursor: 'pointer', display: 'flex', alignItems: 'center' } : undefined}
			onMouseDown={onMouseDown}
			role="presentation"
			title={primaryKey}
		>
			{themeEntityLogoEnabled && (
				<div
					className={`quick-search-result-entity quick-search-result-entity-${optionIndex}`}
					style={{
						backgroundColor: logoEntityColors[optionIndex],
						borderRadius: themeEntityLogoBorderRadius,
						width: themeEntityLogoWidth,
						margin: themeEntityLogoMargin,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						...themeEntityLogoCSS,
					}}
				>
					<div>{entityName.slice(0, 2).toUpperCase()}</div>
				</div>
			)}

			<div
				className="quick-search-result-details"
				style={{ overflow: 'hidden' }}
			>
				<div
					className="quick-search-result-key"
					style={{ fontSize: themeResultKeyTextFontSize, lineHeight: themeDropdownItemsLineHeight, ...themeResultKeyTextCSS }}
				>
					<TextHighlight highlightText={inputValue} content={primaryKey} />
				</div>

				{primaryKey === result || (
					<div
						className="quick-search-result-value"
						style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontSize: themeResultValueFontSize, whiteSpace: 'nowrap', ...themeResultValueCSS }}
					>
						<TextHighlight highlightText={inputValue} content={result} />
					</div>
				)}
			</div>
		</div>
	);
};

export default QuickSearchDropdownItem;
