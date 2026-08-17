import cx from 'classnames';
import { isEqual } from 'lodash-es';
import { Component } from 'react';

import strToReg from '#utils/strToReg';

import styles from './styles.module.css';

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
		const { content, highlightColor, highlightText, className } = this.props;

		/** @type {(import('react').CSSProperties & Record<string, string>) | undefined} */
		const highlightedStyle = highlightColor ? { '--arranger-text-highlight-background': highlightColor } : undefined;

		if (highlightText) {
			// TODO: abstract into a custom hook to resolve <span> duplication
			const regex = strToReg(highlightText, { modifiers: 'i' });
			const matchResult = content.match(regex);
			const foundIndex = matchResult?.index;
			const seg1 = content.substring(0, foundIndex);
			const foundQuery = matchResult?.[0];
			const seg2 = foundIndex !== undefined ? content.substring(foundIndex + foundQuery?.length, content.length) : null;

			return (
				<span className={cx(styles.textHighlight, className)}>
					{seg1}
					<span
						className={styles.highlighted}
						style={highlightedStyle}
					>
						{foundQuery}
					</span>
					{seg2}
				</span>
			);
		}

		return <span className={cx(styles.textHighlight, className)}>{content}</span>;
	}
}

export default TextHighlight;
