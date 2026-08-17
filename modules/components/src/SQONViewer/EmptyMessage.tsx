import cx from 'classnames';

import styles from './EmptyMessage.module.css';

const EmptyMessage = ({ message, className }: { message: string; className?: string }) => {
	return (
		<div className={cx(styles.emptyMessage, className)}>
			<span className={styles.arrow}>{'\u2190'}</span>

			{message}
		</div>
	);
};

export default EmptyMessage;
