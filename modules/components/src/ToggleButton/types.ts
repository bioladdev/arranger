import type { CSSProperties, FC, HTMLProps } from 'react';

import type { ThemedButtonProps } from '#Button/types';
import type { RecursivePartial } from '#utils/types';

export interface Option {
	disabled?: boolean;
	title?: FC<{ toggleStatus?: string } | undefined>;
	value: string;
}

export interface ToggleButtonThemeProps extends ThemedButtonProps {
	OptionCSS?: CSSProperties;
}

export default interface Props extends Omit<HTMLProps<HTMLButtonElement>, 'onChange'> {
	onChange?: ({ value }: { value: string }) => any;
	options: Option[];
	theme?: RecursivePartial<ToggleButtonThemeProps>;
	value: string;
}
