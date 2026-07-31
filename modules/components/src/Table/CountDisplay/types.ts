import type { LoaderThemeProps } from '#Loader/types';
import type { ThemeCommon } from '#ThemeContext/types/index';
import type { RecursivePartial } from '#utils/types';

export type CountDisplayThemeProps = {
	hideLoader: boolean;

	// Child components
	Loader: LoaderThemeProps;
	spacing: string;
} & ThemeCommon.FontProperties;

export type CountDisplayProps = {
	theme?: RecursivePartial<CountDisplayThemeProps>;
} & ThemeCommon.CustomCSS;
