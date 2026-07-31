import type { ReactNode } from 'react';

import type { ThemedButtonProps } from '#Button/types';
import type { DropDownThemeProps } from '#DropDown/types';
import type { InputThemeProps } from '#Input/types';
import type { ThemeCommon } from '#ThemeContext/types/index';
import type { RecursivePartial } from '#utils/types';

export interface ColumnSelectButtonThemeProps extends ThemedButtonProps, DropDownThemeProps {
	enableFilter: boolean;
	filterPlaceholder: string;
	label: ReactNode;
	TextFilter: InputThemeProps;
}

export interface ColumnSelectButtonProps extends ThemeCommon.CustomCSS {
	theme?: RecursivePartial<ColumnSelectButtonThemeProps>;
}
