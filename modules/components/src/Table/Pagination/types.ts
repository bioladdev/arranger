import type { MaxRowsSelectorThemeProps } from '#Table/MaxRowsSelector/types';
import type { PageSelectorThemeProps } from '#Table/PageSelector/types';
import type { ThemeCommon } from '#ThemeContext/types/index';
import type { RecursivePartial } from '#utils/types';

export interface PaginationThemeProps extends ThemeCommon.FontProperties {
	MaxRowSelector: MaxRowsSelectorThemeProps;
	PageSelector: PageSelectorThemeProps;
}

export interface PaginationProps extends ThemeCommon.CustomCSS {
	theme?: RecursivePartial<PaginationThemeProps>;
}
