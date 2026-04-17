import { useCallback, useReducer } from 'react';
import type { SqonNode } from '@overture-stack/sqon';

export type SQONEntry = { sqon: SqonNode | null };

type State = {
	history: SQONEntry[];
	cursor: number;
};

type Action =
	| { type: 'SET_SQON'; payload: SqonNode }
	| { type: 'CLEAR_SQON' }
	| { type: 'UNDO' }
	| { type: 'REDO' };

const initialState: State = {
	history: [{ sqon: null }],
	cursor: 0,
};

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'SET_SQON': {
			const history = [...state.history.slice(0, state.cursor + 1), { sqon: action.payload }];
			return { history, cursor: history.length - 1 };
		}
		case 'CLEAR_SQON': {
			const history = [...state.history.slice(0, state.cursor + 1), { sqon: null }];
			return { history, cursor: history.length - 1 };
		}
		case 'UNDO':
			if (state.cursor === 0) return state;
			return { ...state, cursor: state.cursor - 1 };
		case 'REDO':
			if (state.cursor === state.history.length - 1) return state;
			return { ...state, cursor: state.cursor + 1 };
	}
}

export function useSQON() {
	const [state, dispatch] = useReducer(reducer, initialState);

	const setSQON = useCallback((sqon: SqonNode) => {
		dispatch({ type: 'SET_SQON', payload: sqon });
	}, []);

	const clearSQON = useCallback(() => {
		dispatch({ type: 'CLEAR_SQON' });
	}, []);

	const undo = useCallback(() => {
		dispatch({ type: 'UNDO' });
	}, []);

	const redo = useCallback(() => {
		dispatch({ type: 'REDO' });
	}, []);

	return {
		sqon: state.history[state.cursor].sqon,
		setSQON,
		clearSQON,
		history: state.history,
		undo,
		redo,
		canUndo: state.cursor > 0,
		canRedo: state.cursor < state.history.length - 1,
	};
}
