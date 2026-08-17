import type { LoaderThemeProps } from '#Loader/types';
import type { ThemeCommon } from '#ThemeContext/types/index';

export type CountDisplayThemeProps = {
	hideLoader: boolean;

	// Child components
	Loader: LoaderThemeProps;
	spacing: string;
} & ThemeCommon.FontProperties;

export type CountDisplayProps = {
	className?: string;
};
