import type { SqonNode } from './types.js';

/**
 * An ordered, mutable collection of {@link SqonNode} objects with immutable return values.
 *
 * `SqonStack` maintains an internal sequence of SQON filter objects. All methods
 * that return the collection do so as a `ReadonlyArray`, preventing external
 * mutation of internal state at the type level. The internal array is mutable
 * for performance — immutability is enforced at the boundary via return types.
 *
 * @example
 * ```ts
 * const stack = new SqonStack();
 * const after = stack.append({ op: 'and', content: [] });
 * const [removed, reverted] = stack.revert();
 * ```
 */
class SqonStack {
	#sqons: Array<SqonNode>;

	/**
	 * Creates a new `SqonStack`.
	 *
	 * @param initial - Optional array of {@link SqonNode} objects to initialise the stack with.
	 *                  Defaults to an empty stack if not provided.
	 */
	constructor(initial?: Array<SqonNode>) {
		this.#sqons = initial ?? [];
	}

	/**
	 * Appends a {@link SqonNode} to the end of the stack.
	 *
	 * Mutates internal state, but returns a frozen snapshot — callers cannot
	 * mutate the returned array.
	 *
	 * @param sqon - The SQON filter object to add.
	 */
	append(sqon: SqonNode): ReadonlyArray<SqonNode> {
		this.#sqons = this.#sqons.concat(sqon);
		return this.#sqons;
	}

	/**
	 * Removes the last {@link SqonNode} from the stack.
	 *
	 * Returns a tuple of the removed node and the remaining stack. If the stack
	 * is empty, returns `[undefined, []]` without throwing.
	 *
	 * @returns A tuple of `[removed SqonNode | undefined, remaining ReadonlyArray]`.
	 */
	revert(): [SqonNode | undefined, ReadonlyArray<SqonNode>] {
		if (this.#sqons.length === 0) {
			return [undefined, this.#sqons];
		}
		const last = this.#sqons.at(-1);
		this.#sqons = this.#sqons.slice(0, -1);
		return [last, this.#sqons];
	}

	/**
	 * Removes all {@link SqonNode} objects from the stack.
	 *
	 * @returns A frozen empty `ReadonlyArray`.
	 */
	clear(): ReadonlyArray<SqonNode> {
		this.#sqons = [];
		return this.#sqons;
	}

	/**
	 * Returns `true` if the stack contains no entries.
	 */
	isEmpty(): boolean {
		return this.#sqons.length === 0;
	}
}

export { SqonStack };
