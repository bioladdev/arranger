import cx from 'classnames';
import { format } from 'date-fns';
import { merge, truncate, xor } from 'lodash-es';
import { useCallback, useState } from 'react';

import { TransparentButton } from '#Button/index';
import type { ButtonProps } from '#Button/types';
import { useDataContext } from '#DataContext/index';
import { Row } from '#Flex/index';
import { useThemeContext } from '#ThemeContext/index';
import type { ThemeCommon } from '#ThemeContext/types/index';
import { emptyObj } from '#utils/noops';
import internalTranslateSQONValue from '#utils/translateSQONValue';

import styles from './helpers.module.css';
import type {
	GroupSQONInterface,
	GroupValueSQONType,
	SQONViewerThemeProps,
	UseDataBubblesProps,
	ValueSQONInterface,
} from './types';

export interface BubbleProps extends ButtonProps {
	onClick?: () => void;
}

export const Bubble = ({ children, className, theme, ...props }: BubbleProps) => {
	const { components: { SQONViewer: { SQONBubble: themeSQONBubbleProps = emptyObj } = emptyObj } = emptyObj } =
		useThemeContext({ callerName: 'SQONViewer - Bubble' });

	return (
		<TransparentButton
			className={cx(styles.bubble, className)}
			theme={merge(
				{
					margin: '0 0.2em',
				},
				themeSQONBubbleProps,
				theme,
			)}
			{...props}
		>
			{children}
		</TransparentButton>
	);
};

export const FieldName = ({ children, className, style: customStyle, ...props }: BubbleProps) => (
	<Bubble
		className={cx(styles.fieldName, className)}
		theme={{ style: { cursor: 'default', ...customStyle } }}
		{...props}
	>
		{children}
	</Bubble>
);

export const Op = ({ children, className, style: customStyle, ...props }: BubbleProps) => (
	<Bubble
		className={cx(styles.op, className)}
		theme={{ style: { cursor: 'default', ...customStyle } }}
		{...props}
	>
		{children}
	</Bubble>
);

export const Value = ({ children, className, ...props }: BubbleProps) => (
	<Bubble className={cx(styles.value, className)} {...props}>
		{children}
	</Bubble>
);

/** Creates the components dynamically, based on data
 * provided by the Server configs' extended mapping.
 */
export const useDataBubbles = ({
	dateFormat = 'yyyy-MM-dd',
	onClear,
	setSQON,
	translateSQONValue = (x) => x,
	valueCharacterLimit,
}: UseDataBubblesProps) => {
	const {
		colors,
		components: {
			SQONViewer: {
				SQONClear: { label: themeSQONClearLabel = 'Clear', ...themeSQONClearProps } = emptyObj,
				SQONFieldName: themeSQONFieldNameProps = emptyObj,
				SQONLessOrMore: themeSQONLessOrMoreProps = emptyObj,
				SQONValue: {
					characterLimit: themeCharacterLimit = 30,
					style: themeSQONValueCustomStyle = emptyObj,
					...themeSQONValueProps
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'SQONViewer - useDataBubbles' });
	const [expanded, setExpanded] = useState<GroupValueSQONType>([]);

	const isExpanded = useCallback((valueSQON: ValueSQONInterface) => expanded.includes(valueSQON), [expanded]);

	const { extendedMapping } = useDataContext({ callerName: 'SQONViewer - useDataBubbles' });
	const findExtendedMappingForField = useCallback(
		(wantedFieldName: string) => extendedMapping.find((mapping) => mapping.fieldName === wantedFieldName),
		[extendedMapping],
	);

	const Clear = ({ nextSQON }: { nextSQON: GroupSQONInterface | null }) => (
		<Bubble
			className={styles.clear}
			style={{ marginLeft: 0, marginRight: '0.5em' }}
			onClick={() => {
				onClear?.();
				setSQON?.(nextSQON);
			}}
			theme={{
				background: colors?.grey?.[200],
				borderRadius: '0.3em',
				disabledBackground: colors?.grey?.[100],
				padding: '0.2em 0.5em',
				...themeSQONClearProps,
			}}
		>
			{themeSQONClearLabel}
		</Bubble>
	);

	const FieldNameCrumb = ({ fieldName, ...fieldProps }: { fieldName: string }) => (
		<FieldName theme={{ fontWeight: 'bold', ...themeSQONFieldNameProps }} {...{ fieldName, ...fieldProps }}>
			{findExtendedMappingForField(fieldName)?.displayName || fieldName}
		</FieldName>
	);

	const lessOrMoreClickHandler = useCallback(
		(valueSQON: ValueSQONInterface) => () => setExpanded(xor(expanded, [valueSQON])),
		[expanded],
	);

	const LessOrMore = ({ valueSQON }: { valueSQON: ValueSQONInterface }) => {
		const showLess = isExpanded(valueSQON);

		return (
			<Bubble
				className={styles.lessOrMore}
				data-collapsed={!showLess}
				onClick={lessOrMoreClickHandler(valueSQON)}
				theme={themeSQONLessOrMoreProps}
			>
				{showLess ? 'less' : '…'}
			</Bubble>
		);
	};

	const ValueCrumb = ({
		style: customStyle,
		fieldName,
		nextSQON,
		value,
		...valueProps
	}: {
		fieldName: string;
		nextSQON: GroupSQONInterface;
		value: any;
	} & ThemeCommon.CustomCSS) => {
		const displayValue = translateSQONValue(
			internalTranslateSQONValue(
				(findExtendedMappingForField(fieldName)?.type === 'date' && format(value, dateFormat)) ||
					(findExtendedMappingForField(fieldName)?.displayValues || {})[value] ||
					value,
			),
		);

		const truncatedValue = truncate(displayValue, {
			length: Number(valueCharacterLimit || themeCharacterLimit),
		});
		const bubbleTitle = truncatedValue.endsWith('...') ? displayValue : undefined;

		return (
			<Value
				onClick={() => setSQON?.(nextSQON)}
				style={{ ...themeSQONValueCustomStyle, ...customStyle }}
				title={bubbleTitle}
				theme={{
					textDecoration: 'underline',
					...themeSQONValueProps,
				}}
				{...valueProps}
			>
				{truncatedValue}
			</Value>
		);
	};

	return {
		Clear,
		FieldNameCrumb,
		isExpanded,
		LessOrMore,
		lessOrMoreClickHandler,
		ValueCrumb,
	};
};

export const SQONGroup = ({
	className,
	children,
	style,
	...props
}: {
	className?: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}) => (
	<Row
		as="section"
		className={cx(styles.sqonGroup, className)}
		wrap
		style={style}
		{...props}
	/>
);

export const SQONValueGroup = ({
	className,
	children,
	background,
	borderColor,
	borderRadius,
	fontColor: color,
	fontSize,
	fontWeight,
	letterSpacing,
	lineHeight,
	margin,
	padding,
	textTransform,
	style: customStyle,
}: SQONViewerThemeProps['SQONValueGroup'] & {
	className?: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}) => (
	<span
		className={cx(styles.sqonValueGroup, className)}
		style={{
			background,
			border: borderColor ? `1px solid ${borderColor}` : undefined,
			borderRadius,
			color,
			fontSize,
			fontWeight,
			letterSpacing,
			lineHeight,
			margin,
			padding,
			textTransform: textTransform as React.CSSProperties['textTransform'],
			...customStyle,
		}}
	>
		{children}
	</span>
);

export const SQONWrapper = ({
	className,
	children,
	fontColor: color,
	fontSize,
	fontWeight,
	style: customStyle,
}: SQONViewerThemeProps['SQONWrapper'] & {
	className?: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}) => (
	<article
		className={className}
		style={{
			alignItems: 'center',
			color,
			display: 'flex',
			flex: 1,
			flexWrap: 'wrap',
			fontSize,
			fontWeight,
			margin: 0,
			padding: '12px 0 12px 12px',
			...customStyle,
		}}
	>
		{children}
	</article>
);
