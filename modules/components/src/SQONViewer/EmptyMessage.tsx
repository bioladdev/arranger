import cx from 'classnames';

import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

const EmptyMessage = ({ className, message }: { className?: string; message: string }) => {
	const {
		components: {
			SQONViewer: {
				EmptyMessage: {
					arrowColor: themeArrowColor,
					className: themeClassName,
					fontColor: themeFontColor,
					fontSize: themeFontSize,
					fontWeight: themeFontWeight = 'normal',
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'EmptyMessage' });

	return (
		<div
			className={cx('sqon-empty-message', themeClassName, className)}
			style={{ color: themeFontColor, fontSize: themeFontSize, fontWeight: themeFontWeight }}
		>
			<span
				className="sqon-empty-message-arrow"
				style={{ color: themeArrowColor, marginRight: '0.2em' }}
			>
				{'\u2190'}
			</span>

			{message}
		</div>
	);
};

export default EmptyMessage;
