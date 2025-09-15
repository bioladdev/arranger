import type { ThemeCommon } from '#ThemeContext/types/index.js';

export interface TextHighlightThemeProps extends ThemeCommon.NonButtonThemeProps {
	wrapperClassName?: string;
	wrapperCSS?: ThemeCommon.cssInterpolation;
}

export interface TextHighlightProps {
	content: string;
	css?: ThemeCommon.cssInterpolation;
	highlightClassName?: string;
	highlightColor?: string;
	highlightText?: string;
}
