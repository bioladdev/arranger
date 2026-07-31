import cx from 'classnames';

import { TransparentButton } from '#Button/index';

// check if all buckets are selected/active or not
export const checkBucketsAllSelected = (isActive, buckets, fieldName) =>
	buckets.every((bucket) => isActive({ fieldName, value: bucket.name }));

const SelectAllButton = ({ className = '', style: customStyle = undefined, areBucketsAllSelected, ...props }) => (
	<TransparentButton
		className={cx('selectAll-wrapper', className)}
		style={{ marginLeft: '0.5rem', textDecoration: 'underline', ...customStyle }}
		{...props}
	>
		{areBucketsAllSelected ? 'Deselect' : 'Select'} All
	</TransparentButton>
);

export default SelectAllButton;
