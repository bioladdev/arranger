import type { ThemeCommon } from '#ThemeContext/types/index';

export interface MaxRowsSelectorThemeProps extends ThemeCommon.NonButtonThemeProps {
	pageSizes: number[];
}

export interface MaxRowsSelectorProps {
	className?: string;
	disabled?: boolean;
	pageSizes?: number[];
}
