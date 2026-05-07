import assert from 'node:assert';
import { suite, test } from 'node:test';

import { esTypeToAggsType } from './extendMapping.js';

suite('esTypeToAggsType', () => {
	test('numeric ES types map to range', () => {
		const numericTypes = ['byte', 'date', 'double', 'float', 'half_float', 'integer', 'long', 'scaled_float', 'unsigned_long'];
		for (const esType of numericTypes) {
			assert.strictEqual(esTypeToAggsType(esType), 'range', `expected 'range' for ES type '${esType}'`);
		}
	});

	test('boolean maps to boolean', () => {
		assert.strictEqual(esTypeToAggsType('boolean'), 'boolean');
	});

	test('string and keyword types map to term', () => {
		const termTypes = ['keyword', 'string', 'text', 'object'];
		for (const esType of termTypes) {
			assert.strictEqual(esTypeToAggsType(esType), 'term', `expected 'term' for ES type '${esType}'`);
		}
	});

	test('unknown input defaults to term', () => {
		assert.strictEqual(esTypeToAggsType('nested'), 'term');
		assert.strictEqual(esTypeToAggsType('unknown_type'), 'term');
		assert.strictEqual(esTypeToAggsType(''), 'term');
	});
});
