import type { HTMLProps } from 'react';

import type { ThemeCommon } from '#ThemeContext/types/index';
import type { RecursivePartial } from '#utils/types';

export type BucketCountThemeProps = ThemeCommon.CustomCSS &
	ThemeCommon.BoxModelActiveProperties &
	ThemeCommon.BoxModelDisabledProperties &
	ThemeCommon.BoxModelProperties &
	ThemeCommon.FontActiveProperties &
	ThemeCommon.FontDisabledProperties &
	ThemeCommon.FontProperties;

export default interface Props extends HTMLProps<HTMLButtonElement>, ThemeCommon.CustomCSS {
	theme?: RecursivePartial<BucketCountThemeProps>;
}
