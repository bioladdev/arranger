import cx from 'classnames';

import noopFn, { emptyObj } from '#utils/noops';

import { NonEmptyArray } from '#types/utility.js';
import { FC, HTMLProps } from 'react';

export interface Option {
	disabled?: boolean;
	title?: FC<{ toggleStatus?: string } | undefined>;
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
		<div className={cx('toggle-button', className)}>
			{options.map(({ disabled = false, title, value = '' }, index) => {
				const active = selectedValue === value;
				const clickHandler = () => (disabled ? null : onChange({ value }));

				return (
					<button
						className={cx('toggle-button-option', {
							active,
							disabled,
						})}
						disabled={disabled}
						key={value || `undefined-${index}`}
						onClick={clickHandler}
					>
						{typeof title === 'function' ? title({ toggleStatus: cx({ active, disabled }) }) : title}
					</button>
				);
			})}
		</div>
	);
};
export default ToggleButton;
