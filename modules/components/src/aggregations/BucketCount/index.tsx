import cx from 'classnames';

import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import styles from './styles.module.css';
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
		components: {
			Aggregations: {
				BucketCount: {
					activeBackground: themeActiveBackground,
					activeBorderColor: themeActiveBorderColor,
					activeFontColor: themeActiveFontColor,
					activeFontSize: themeActiveFontSize,
					background: themeBackground,
					borderColor: themeBorderColor,
					borderRadius: themeBorderRadius,
					className: themeClassName,
					style: themeStyle,
					disabledBackground: themeDisabledBackground,
					disabledBorderColor: themeDisabledBorderColor,
					disabledFontColor: themeDisabledFontColor,
					disabledFontSize: themeDisabledFontSize,
					fontColor: themeFontColor,
					fontSize: themeFontSize,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'BucketCount' });

	const combinedClassName = cx(className, customClassName, themeClassName);
	const isActive = combinedClassName?.split(' ').includes('active');
	const isDisabled = combinedClassName?.split(' ').includes('disabled');

	const hasBorder = Boolean(
		borderColor ||
			themeBorderColor ||
			customActiveBorderColor ||
			themeActiveBorderColor ||
			customDisabledBorderColor ||
			themeDisabledBorderColor,
	);

	const themeCustomProperties = {
		'--arranger-bucket-count-active-background': customActiveBackground || themeActiveBackground,
		'--arranger-bucket-count-active-border-color': customActiveBorderColor || themeActiveBorderColor,
		'--arranger-bucket-count-active-font-color': customActiveFontColor || themeActiveFontColor,
		'--arranger-bucket-count-active-font-size': customActiveFontSize || themeActiveFontSize,
		'--arranger-bucket-count-background': background || themeBackground,
		'--arranger-bucket-count-border-color': borderColor || themeBorderColor,
		'--arranger-bucket-count-border-radius': borderRadius || themeBorderRadius,
		'--arranger-bucket-count-disabled-background': customDisabledBackground || themeDisabledBackground,
		'--arranger-bucket-count-disabled-border-color': customDisabledBorderColor || themeDisabledBorderColor,
		'--arranger-bucket-count-disabled-font-color': customDisabledFontColor || themeDisabledFontColor,
		'--arranger-bucket-count-disabled-font-size': customDisabledFontSize || themeDisabledFontSize,
		'--arranger-bucket-count-font-color': fontColor || themeFontColor,
		'--arranger-bucket-count-font-size': fontSize || themeFontSize,
	};

	return (
		<span
			className={cx(styles.bucketCount, className, customClassName, themeClassName)}
			data-active={isActive}
			data-disabled={isDisabled}
			data-has-border={hasBorder}
			style={{ ...themeCustomProperties, ...themeStyle, ...parentStyle, ...customStyle }}
			{...props}
		>
			{children}
		</span>
	);
};

export default BucketCount;
