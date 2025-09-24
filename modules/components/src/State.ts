import { useCallback, useEffect, useRef, useState } from 'react';

import noopFn from '#utils/noops.js';

interface StateProps {
	initial?: Record<string, any>;
	async?: () => Promise<any> | any;
	onReceiveProps?: (args: { props: StateProps; state: any; update: (object: any, onComplete?: () => void) => void }) => void;
	didUpdate?: (args: { prevProps: StateProps; prevState: any; update: (object: any, onComplete?: () => void) => void; [key: string]: any }) => void;
	render: (args: { update: (object: any, onComplete?: () => void) => void; [key: string]: any }) => React.ReactNode;
}

/**
 * @deprecated This component has been deprecated in favor of react-component-component or custom hooks
 */
const State = ({ initial = {}, async = noopFn, onReceiveProps, didUpdate, render }: StateProps) => {
	console.warn(
		'[[ DEPRECATION WARNING ]]: the State component has been deprecated in favor of react-component-component or custom hooks',
	);
	
	const [state, setState] = useState(initial);
	const prevPropsRef = useRef<StateProps>({ initial, async, onReceiveProps, didUpdate, render });
	const prevStateRef = useRef(initial);

	const update = useCallback((object: any, onComplete: () => void = noopFn) => {
		setState((prevState) => {
			const newState = { ...prevState, ...object };
			// Call onComplete after state update
			setTimeout(() => onComplete(), 0);
			return newState;
		});
	}, []);

	useEffect(() => {
		Promise.resolve(async()).then(update);
	}, [async, update]);

	useEffect(() => {
		const prevProps = prevPropsRef.current;
		if (onReceiveProps) {
			onReceiveProps({ props: { initial, async, onReceiveProps, didUpdate, render }, state, update });
		}
		prevPropsRef.current = { initial, async, onReceiveProps, didUpdate, render };
	}, [initial, async, onReceiveProps, didUpdate, render, state, update]);

	useEffect(() => {
		const prevProps = prevPropsRef.current;
		const prevState = prevStateRef.current;
		
		if (didUpdate) {
			didUpdate({
				prevProps,
				prevState,
				update,
				...state,
			});
		}
		
		prevStateRef.current = state;
	}, [state, didUpdate, update]);

	return render({
		...state,
		update,
	});
};

export default State;
