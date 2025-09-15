import { css } from '@emotion/react';
import cx from 'classnames';
import { memo } from 'react';

import { useThemeContext } from '#ThemeContext/index.js';
import { emptyObj } from '#utils/noops.js';
import strToReg from '#utils/strToReg.js';

import type { TextHighlightProps } from './types.js';

const TextHighlight = memo<TextHighlightProps>(({
	content,
	css: customCSS,
	highlightClassName,
	highlightColor,
	highlightText,
}) => {
	const theme = useThemeContext();
	
	const {
		colors,
		components: {
			TextHighlight: {
				background: themeBackground = colors?.amber?.[200],
				borderColor: themeBorderColor,
				borderRadius: themeBorderRadius,
				className: themeClassName,
				css: themeCSS,
				fontcolor: themeFontColor = colors?.grey?.[900],
				fontDecoration: themeFontDecoration,
				fontSize: themeFontSize,
				fontWeight: themeFontWeight,
				margin: themeMargin,
				padding: themePadding,
				wrapperClassName: themeWrapperClassName,
				wrapperCSS: themeWrapperCSS,
			} = emptyObj,
		} = emptyObj,
	} = theme;

	if (highlightText) {
		// TODO: abstract into a custom hook to resolve <span> duplication
		const regex = strToReg(highlightText, { modifiers: 'i' });
		const matchResult = content.match(regex);
		const foundIndex = matchResult?.index;
		const seg1 = content.substring(0, foundIndex);
		const foundQuery = matchResult?.[0];
		const seg2 = foundIndex !== undefined ? content.substring(foundIndex + foundQuery?.length, content.length) : null;

		return (
			<span
				className={cx('textHighlight active', themeWrapperClassName)}
				css={[
					themeWrapperCSS,
					css`
						// internal customisation should go here
					`,
				]}
			>
				{seg1}
				<span
					className={cx('highlighted', highlightClassName, themeClassName)}
					css={[
						themeCSS,
						css`
							background: ${themeBackground || highlightColor};
							border: ${themeBorderColor && `1px solid ${themeBorderColor}`};
							border-radius: ${themeBorderRadius};
							color: ${themeFontColor};
							font-size: ${themeFontSize};
							font-weight: ${themeFontWeight};
							margin: ${themeMargin};
							padding: ${themePadding};
							text-decoration: ${themeFontDecoration};
						`,
						customCSS,
					]}
				>
					{foundQuery}
				</span>
				{seg2}
			</span>
		);
	}

	return (
		<span
			className={cx('textHighlight active', themeWrapperClassName)}
			css={[
				themeWrapperCSS,
				css`
					// internal customisation should go here
				`,
			]}
		>
			{content}
		</span>
	);
});

TextHighlight.displayName = 'TextHighlight';

export default TextHighlight;
