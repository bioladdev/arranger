import { act, renderHook } from '@testing-library/react';
import type { SqonNode } from '@overture-stack/sqon';
import { useSQON } from './useSQON.js';

const sqon1: SqonNode = {
	op: 'and',
	content: [{ op: 'in', content: { fieldName: 'gender', value: ['male'] } }],
};

const sqon2: SqonNode = {
	op: 'and',
	content: [{ op: 'in', content: { fieldName: 'status', value: ['alive'] } }],
};

describe('useSQON', () => {
	describe('initial state', () => {
		it('sqon is null', () => {
			const { result } = renderHook(() => useSQON());
			expect(result.current.sqon).toBeNull();
		});

		it('history contains one null entry', () => {
			const { result } = renderHook(() => useSQON());
			expect(result.current.history).toEqual([{ sqon: null }]);
		});

		it('canUndo is false', () => {
			const { result } = renderHook(() => useSQON());
			expect(result.current.canUndo).toBe(false);
		});

		it('canRedo is false', () => {
			const { result } = renderHook(() => useSQON());
			expect(result.current.canRedo).toBe(false);
		});
	});

	describe('setSQON', () => {
		it('updates sqon', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			expect(result.current.sqon).toEqual(sqon1);
		});

		it('appends to history', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			expect(result.current.history).toHaveLength(2);
			expect(result.current.history[1]).toEqual({ sqon: sqon1 });
		});

		it('enables canUndo', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			expect(result.current.canUndo).toBe(true);
		});

		it('accumulates history across multiple calls', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.setSQON(sqon2));
			expect(result.current.history).toHaveLength(3);
			expect(result.current.sqon).toEqual(sqon2);
		});
	});

	describe('clearSQON', () => {
		it('resets sqon to null', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.clearSQON());
			expect(result.current.sqon).toBeNull();
		});

		it('appends a null entry to history', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.clearSQON());
			expect(result.current.history).toHaveLength(3);
			expect(result.current.history[2]).toEqual({ sqon: null });
		});
	});

	describe('undo', () => {
		it('restores the previous sqon', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.undo());
			expect(result.current.sqon).toBeNull();
		});

		it('sets canUndo false at history start', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.undo());
			expect(result.current.canUndo).toBe(false);
		});

		it('sets canRedo true after undoing', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.undo());
			expect(result.current.canRedo).toBe(true);
		});

		it('is a no-op at the start of history', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.undo());
			expect(result.current.sqon).toBeNull();
			expect(result.current.canUndo).toBe(false);
		});
	});

	describe('redo', () => {
		it('restores the next sqon after an undo', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.undo());
			act(() => result.current.redo());
			expect(result.current.sqon).toEqual(sqon1);
		});

		it('sets canRedo false at history end', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.undo());
			act(() => result.current.redo());
			expect(result.current.canRedo).toBe(false);
		});

		it('restores canUndo after redo', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.undo());
			act(() => result.current.redo());
			expect(result.current.canUndo).toBe(true);
		});

		it('is a no-op at the end of history', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.redo());
			expect(result.current.sqon).toEqual(sqon1);
			expect(result.current.canRedo).toBe(false);
		});
	});

	describe('setSQON after undo (branching)', () => {
		it('truncates future history', () => {
			const { result } = renderHook(() => useSQON());
			act(() => result.current.setSQON(sqon1));
			act(() => result.current.setSQON(sqon2));
			act(() => result.current.undo()); // back to sqon1
			act(() => result.current.setSQON(sqon2)); // branch — drops the old sqon2
			expect(result.current.history).toHaveLength(3);
			expect(result.current.canRedo).toBe(false);
		});
	});
});
