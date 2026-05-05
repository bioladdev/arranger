import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SqonStack } from './SqonStack.js';

describe('SqonStack', () => {
	describe('append', () => {
		it('adds a sqon to the stack and returns the updated array', () => {
			const stack = new SqonStack();
			const result = stack.append({ op: 'and', content: [] });
			assert.equal(result.length, 1);
		});

		it('preserves existing entries', () => {
			const stack = new SqonStack();
			stack.append({ op: 'and', content: [] });
			const result = stack.append({ op: 'or', content: [] });
			assert.equal(result.length, 2);
		});
	});

	describe('revert', () => {
		it('removes and returns the last sqon', () => {
			const stack = new SqonStack();
			const sqon = { op: 'and', content: [] };
			stack.append(sqon);
			const [removed, remaining] = stack.revert();
			assert.deepEqual(removed, sqon);
			assert.equal(remaining.length, 0);
		});

		it('returns [undefined, []] when stack is empty', () => {
			const stack = new SqonStack();
			const [removed, remaining] = stack.revert();
			assert.equal(removed, undefined);
			assert.equal(remaining.length, 0);
		});

		it('returns the last item not the new current', () => {
			const stack = new SqonStack();
			const first = { op: 'and', content: [] };
			const second = { op: 'or', content: [] };
			stack.append(first);
			stack.append(second);
			const [removed] = stack.revert();
			assert.deepEqual(removed, second);
		});
	});

	describe('clear', () => {
		it('empties the stack', () => {
			const stack = new SqonStack();
			stack.append({ op: 'and', content: [] });
			const result = stack.clear();
			assert.equal(result.length, 0);
		});
	});

	describe('isEmpty', () => {
		it('returns true on a new stack', () => {
			assert.equal(new SqonStack().isEmpty(), true);
		});

		it('returns false after an append', () => {
			const stack = new SqonStack();
			stack.append({ op: 'and', content: [] });
			assert.equal(stack.isEmpty(), false);
		});

		it('returns true after clear', () => {
			const stack = new SqonStack();
			stack.append({ op: 'and', content: [] });
			stack.clear();
			assert.equal(stack.isEmpty(), true);
		});
	});
});
