import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SQONStack } from './index.js';

describe('SQONStack', () => {
	it('append returns a new instance', () => {
		const stack = new SQONStack();
		const next = stack.append({ filter: 'a' });
		assert.notEqual(stack, next);
	});

	it('original stack is unchanged after append', () => {
		const stack = new SQONStack();
		stack.append({ filter: 'a' });
		assert.equal(stack.length, 0);
		assert.equal(stack.isEmpty(), true);
	});

	it('revert returns the correct tuple', () => {
		const sqon = { filter: 'a' };
		const stack = new SQONStack().append(sqon);
		const [removed, next] = stack.revert();
		assert.deepEqual(removed, sqon);
		assert.equal(next.length, 0);
	});

	it('revert on empty stack returns [undefined, emptyStack] without throwing', () => {
		const stack = new SQONStack();
		const [removed, next] = stack.revert();
		assert.equal(removed, undefined);
		assert.equal(next, stack);
	});

	it('isEmpty reflects state correctly', () => {
		const empty = new SQONStack();
		assert.equal(empty.isEmpty(), true);
		const one = empty.append({ x: 1 });
		assert.equal(one.isEmpty(), false);
		const [, reverted] = one.revert();
		assert.equal(reverted.isEmpty(), true);
	});

	it('length reflects state correctly', () => {
		const stack = new SQONStack();
		assert.equal(stack.length, 0);
		const one = stack.append({ a: 1 });
		assert.equal(one.length, 1);
		const two = one.append({ b: 2 });
		assert.equal(two.length, 2);
		const [, back] = two.revert();
		assert.equal(back.length, 1);
	});

	it('current returns the last appended item', () => {
		const first = { a: 1 };
		const second = { b: 2 };
		const stack = new SQONStack().append(first).append(second);
		assert.deepEqual(stack.current, second);
	});

	it('current is undefined on an empty stack', () => {
		const stack = new SQONStack();
		assert.equal(stack.current, undefined);
	});
});
