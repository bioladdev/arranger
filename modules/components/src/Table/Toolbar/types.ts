import type { ElementType } from 'react';

import type { CountDisplayThemeProps } from '#Table/CountDisplay/types';
import type { ThemeCommon } from '#ThemeContext/types/index';
import type { RecursivePartial } from '#utils/types';

export type ToolbarThemeProps = {
	spacing: string;
	tools: ElementType[];
	CountDisplay: CountDisplayThemeProps;
} & ThemeCommon.FontProperties &
	ThemeCommon.CustomCSS;

export type ToolbarProps = {
	theme?: RecursivePartial<ToolbarThemeProps>;
} & ThemeCommon.CustomCSS;
