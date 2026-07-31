import cx from 'classnames';

import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import type Props from './types';

const BucketCount = ({
	className,
	children,
	style: customStyle,
	theme: {
		activeBackground: customActiveBackground,
		activeBorderColor: customActiveBorderColor,
		activeFontColor: customActiveFontColor,
		activeFontSize: customActiveFontSize,
		background,
		borderColor,
		borderRadius,
		className: customClassName,
		style: parentStyle,
		disabledBackground: customDisabledBackground,
		disabledBorderColor: customDisabledBorderColor,
		disabledFontColor: customDisabledFontColor,
		disabledFontSize: customDisabledFontSize,
		fontColor,
		fontSize,
	} = emptyObj,
	...props
}: Props) => {
	const {
		colors,
		components: {
			Aggregations: {
				BucketCount: {
					activeBackground: themeActiveBackground,
					activeBorderColor: themeActiveBorderColor,
					activeFontColor: themeActiveFontColor,
					activeFontSize: themeActiveFontSize,
					background: themeBackground = colors?.grey?.[200],
					borderColor: themeBorderColor,
					borderRadius: themeBorderRadius = '0.2rem',
					className: themeClassName,
					style: themeStyle,
					disabledBackground: themeDisabledBackground = colors?.common?.white,
					disabledBorderColor: themeDisabledBorderColor,
					disabledFontColor: themeDisabledFontColor = colors?.grey?.[700],
					disabledFontSize: themeDisabledFontSize,
					fontColor: themeFontColor = colors?.grey?.[900],
					fontSize: themeFontSize = '0.7rem',
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'BucketCount' });

	const hasBorder =
		borderColor ||
		themeBorderColor ||
		customActiveBorderColor ||
		themeActiveBorderColor ||
		customDisabledBorderColor ||
		themeDisabledBorderColor;

	return (
		<span
			className={cx(`bucket-count`, className, customClassName, themeClassName)}
			// TODO: restore hover/focus styles via CSS
			style={{
				background: background || themeBackground,
				border: hasBorder && '0.1rem solid transparent',
				borderColor: borderColor || themeBorderColor,
				borderRadius: borderRadius || themeBorderRadius,
				color: fontColor || themeFontColor,
				display: 'inline-block',
				fontSize: fontSize || themeFontSize,
				height: 'fit-content',
				padding: '0 0.2rem',
				...themeStyle,
				...parentStyle,
				...customStyle,
			}}
			{...props}
		>
			{children}
		</span>
	);
};

export default BucketCount;
