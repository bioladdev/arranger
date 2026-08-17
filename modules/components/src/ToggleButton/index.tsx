import cx from 'classnames';

import noopFn, { emptyObj } from '#utils/noops';

import { NonEmptyArray } from '#types/utility.js';
import { HTMLProps, ReactNode } from 'react';

import styles from './styles.module.css';

export interface Option {
	disabled?: boolean;
	title?: (props: { active: boolean; disabled: boolean }) => ReactNode;
	value: string;
}

interface Props extends Omit<HTMLProps<HTMLButtonElement>, 'onChange'> {
	onChange?: ({ value }: { value: string }) => void;
	options: NonEmptyArray<Option>;
	value: string;
}

/**
 * ToggleButton
 * @param param0
 * @returns
 */
const ToggleButton = ({ onChange = noopFn, options, value: selectedValue = '', className }: Props) => {
	return (
		<div className={cx(styles.toggleButton, className)}>
			{options.map(({ disabled = false, title, value = '' }, index) => {
				const active = selectedValue === value;
				const clickHandler = () => (disabled ? null : onChange({ value }));

				return (
					<button
						className={cx(styles.option)}
						data-active={active}
						data-disabled={disabled}
						disabled={disabled}
						key={value || `undefined-${index}`}
						onClick={clickHandler}
					>
						{typeof title === 'function' ? title({ active, disabled }) : title}
					</button>
				);
			})}
		</div>
	);
};
export default ToggleButton;
