import cx from 'classnames';
import { merge } from 'lodash-es';
import Spinkit from 'react-spinkit';

import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import styles from './Loader.module.css';
import type { LoaderContainerProps, LoaderOverlayProps, LoaderProps } from './types';

const DefaultSpinner = ({ color, size }: { color?: string; size?: string | number }) => {
	return <div>spinner</div>;
};

const LoaderBackground = ({
	children,
	className,
	isLoading,
	style: customStyle,
}: {
	children?: React.ReactNode;
	className?: string;
	isLoading?: boolean;
	style?: React.CSSProperties;
}) => (
	<div
		className={cx(styles.loaderBackground, className)}
		data-loading={Boolean(isLoading)}
		style={customStyle}
	>
		{children}
	</div>
);

const Loader = ({
	children,
	className = '',
	style: customStyle,
	theme: { color: customColor, Component: customComponent, inverted, size: customSize, vertical } = emptyObj,
}: LoaderProps) => {
	const {
		components: {
			Loader: {
				color: themeColor,
				Component: themeComponent = DefaultSpinner,
				style: themeStyle,
				size: themeSize = 30,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Loader' });

	const Component = customComponent || themeComponent;
	const isVertical = Boolean(vertical);
	const isInverted = Boolean(inverted);
	const captionMarginSide = isVertical ? (isInverted ? 'bottom' : 'top') : isInverted ? 'right' : 'left';
	const captionThemeStyle = {
		[`--arranger-loader-caption-margin-${captionMarginSide}`]: '0.5rem',
	};

	return (
		<figure
			className={cx('Spinner', styles.spinner, className)}
			data-inverted={isInverted}
			data-vertical={isVertical}
			style={{ ...themeStyle, ...customStyle }}
		>
			<Component
				color={customColor || themeColor}
				size={customSize || themeSize}
			/>

			{children && (
				<figcaption
					className={styles.caption}
					style={captionThemeStyle}
				>
					{children}
				</figcaption>
			)}
		</figure>
	);
};

const LoaderOverlay = ({ theme: customThemeProps }: LoaderOverlayProps) => {
	const { components: { LoaderOverlay: themeProps = emptyObj } = emptyObj } = useThemeContext({
		callerName: 'LoaderOverlay',
	});

	const theme = merge({}, themeProps, customThemeProps);

	return (
		<div className={styles.overlay}>
			<Loader {...theme} />
		</div>
	);
};

export const LoaderContainer = ({
	children,
	className,
	disabled: customDisabled,
	isLoading = false,
	theme: {
		background: customBackground,
		borderColor: customBorderColor,
		fontColor: customFontColor,
		fontSize: customFontSize,
		lineHeight: customLineHeight,
		...customThemeProps
	} = emptyObj,
}: LoaderContainerProps) => {
	const {
		colors,
		components: {
			LoaderContainer: {
				background: themeBackground = colors?.grey?.[100],
				borderColor: themeBorderColor = colors?.grey?.[400],
				disabled: themeDisabled,
				fontColor: themeFontColor = '0.85rem',
				fontSize: themeFontSize = '0.85rem',
				lineHeight: themeLineHeight = '1.3rem',
				...themeProps
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({
		callerName: 'LoaderContainer',
	});

	const enableOverlay = !(customDisabled || themeDisabled);

	return (
		<LoaderBackground {...{ className, isLoading }}>
			{children}

			{enableOverlay && isLoading && (
				<LoaderOverlay
					theme={{
						background: customBackground || themeBackground,
						borderColor: customBorderColor || themeBorderColor,
						fontColor: customFontColor || themeFontColor,
						fontSize: customFontSize || themeFontSize,
						lineHeight: customLineHeight || themeLineHeight,
						...themeProps,
						...customThemeProps,
					}}
				/>
			)}
		</LoaderBackground>
	);
};

export default Loader;
