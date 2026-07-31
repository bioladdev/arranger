import type { ThemeCommon } from '#ThemeContext/types/index';
import type { RecursivePartial } from '#utils/types';

export interface MaxRowsSelectorThemeProps extends ThemeCommon.NonButtonThemeProps {
	pageSizes: number[];
}

export interface MaxRowsSelectorProps extends ThemeCommon.CustomCSS {
	disabled?: boolean;
	theme?: RecursivePartial<MaxRowsSelectorThemeProps>;
}
