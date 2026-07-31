import cx from 'classnames';
import { isEqual } from 'lodash-es';
import { Component } from 'react';

import { withTheme } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';
import strToReg from '#utils/strToReg';

// TODO: turn into function... component could use hooks.
// TODO: temprorarily quieting down TS errors to help migration
/**
 * @param {*} props
 */
class TextHighlight extends Component {
	shouldComponentUpdate(nextProps) {
		return !isEqual(nextProps, this.props);
	}

	render() {
		const {
			content,
			style: customStyle,
			highlightClassName,
			highlightColor,
			highlightText,
			theme: {
				colors,
				components: {
					TextHighlight: {
						background: themeBackground = colors?.amber?.[200],
						borderColor: themeBorderColor,
						borderRadius: themeBorderRadius,
						className: themeClassName,
						style: themeStyle,
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
			} = emptyObj,
		} = this.props;

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
					style={{ ...themeWrapperCSS }}
				>
					{seg1}
					<span
						className={cx('highlighted', highlightClassName, themeClassName)}
						style={{
							background: themeBackground || highlightColor,
							border: themeBorderColor && `1px solid ${themeBorderColor}`,
							borderRadius: themeBorderRadius,
							color: themeFontColor,
							fontSize: themeFontSize,
							fontWeight: themeFontWeight,
							margin: themeMargin,
							padding: themePadding,
							textDecoration: themeFontDecoration,
							...themeStyle,
							...customStyle,
						}}
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
				style={{ ...themeWrapperCSS }}
			>
				{content}
			</span>
		);
	}
}

export default withTheme(TextHighlight);
