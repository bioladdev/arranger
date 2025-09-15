import { useCallback, useEffect, useRef } from 'react';

interface ClickAwayListenerProps extends React.HTMLAttributes<HTMLSpanElement> {
	handler?: (event: MouseEvent) => void;
}

/**
 * This is a utility component for handling clickaway events.
 * All props other than `handler` are passed down to the dom wrapper
 * so customization is possible through normal react-dom API
 */
const ClickAwayListener = ({ handler = () => {}, ...rest }: ClickAwayListenerProps) => {
	const ref = useRef<HTMLSpanElement>(null);

	const clickHandler = useCallback(
		(e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				handler(e);
			}
		},
		[handler],
	);

	useEffect(() => {
		document.addEventListener('click', clickHandler);
		return () => {
			document.removeEventListener('click', clickHandler);
		};
	}, [clickHandler]);

	return <span {...rest} ref={ref} />;
};

export default ClickAwayListener;
