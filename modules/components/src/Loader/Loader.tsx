import cx from 'classnames';
import color from 'color';
import { merge } from 'lodash-es';
import Spinkit from 'react-spinkit';

import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

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
		className={className}
		style={{
			borderRadius: 8,
			position: 'relative',
			overflow: isLoading ? 'hidden' : 'visible',
			boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.08)',
			...customStyle,
		}}
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
		colors,
		components: {
			Loader: {
				color: themeColor = colors?.grey?.[600],
				Component: themeComponent = DefaultSpinner,
				style: themeStyle,
				size: themeSize = 30,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Loader' });

	const Component = customComponent || themeComponent;

	return (
		<figure
			className={cx('Spinner', className)}
			style={{
				alignItems: 'center',
				bottom: 0,
				display: 'flex',
				flexDirection: vertical ? (inverted ? 'column-reverse' : 'column') : inverted ? 'row-reverse' : 'row',
				justifyContent: 'center',
				left: 0,
				margin: 0,
				position: 'relative',
				right: 0,
				top: 0,
				...themeStyle,
				...customStyle,
			}}
		>
			<Component
				color={customColor || themeColor}
				size={customSize || themeSize}
			/>

			{children && (
				<figcaption
					style={{
						[`margin-${vertical ? (inverted ? 'bottom' : 'top') : inverted ? 'right' : 'left'}`]: '0.5rem',
					}}
				>
					{children}
				</figcaption>
			)}
		</figure>
	);
};

const LoaderOverlay = ({ theme: customThemeProps }: LoaderOverlayProps) => {
	const { colors, components: { LoaderOverlay: themeProps = emptyObj } = emptyObj } = useThemeContext({
		callerName: 'LoaderOverlay',
	});

	const theme = merge({}, themeProps, customThemeProps);

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				background: color(colors?.common?.white).alpha(0.7).hsl().string(),
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
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
