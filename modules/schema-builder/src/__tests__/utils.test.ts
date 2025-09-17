import { combineTypeDefs, createEnum, createUnion, gql, validateTypeDef, extractTypeNames, deduplicateTypeDefs } from '../utils';

describe('utils', () => {
	describe('combineTypeDefs', () => {
		it('should combine multiple type definitions', () => {
			const result = combineTypeDefs(
				'type User { id: ID! }',
				'type Post { title: String }'
			);
			expect(result).toBe('type User { id: ID! }\n\ntype Post { title: String }');
		});

		it('should handle #graphql comments', () => {
			const result = combineTypeDefs(
				'#graphql\ntype User { id: ID! }',
				'type Post { title: String }'
			);
			expect(result).toBe('type User { id: ID! }\n\ntype Post { title: String }');
		});

		it('should filter out empty strings', () => {
			const result = combineTypeDefs('type User { id: ID! }', '', 'type Post { title: String }');
			expect(result).toBe('type User { id: ID! }\n\ntype Post { title: String }');
		});
	});

	describe('createEnum', () => {
		it('should create a GraphQL enum', () => {
			const result = createEnum('Status', ['ACTIVE', 'INACTIVE', 'PENDING']);
			expect(result).toContain('enum Status');
			expect(result).toContain('ACTIVE');
			expect(result).toContain('INACTIVE');
			expect(result).toContain('PENDING');
		});
	});

	describe('createUnion', () => {
		it('should create a GraphQL union', () => {
			const result = createUnion('SearchResult', ['User', 'Post', 'Comment']);
			expect(result).toContain('union SearchResult = User | Post | Comment');
		});
	});

	describe('gql', () => {
		it('should create a tagged template literal', () => {
			const name = 'User';
			const result = gql`
				type ${name} {
					id: ID!
				}
			`;
			expect(result).toContain('#graphql');
			expect(result).toContain('type User');
		});
	});

	describe('validateTypeDef', () => {
		it('should validate correct type definitions', () => {
			expect(validateTypeDef('type User { id: ID! }')).toBe(true);
			expect(validateTypeDef('enum Status { ACTIVE }')).toBe(true);
			expect(validateTypeDef('interface Node { id: ID! }')).toBe(true);
			expect(validateTypeDef('scalar JSON')).toBe(true);
		});

		it('should reject invalid type definitions', () => {
			expect(validateTypeDef('invalid definition')).toBe(false);
			expect(validateTypeDef('')).toBe(false);
		});

		it('should handle #graphql comments', () => {
			expect(validateTypeDef('#graphql\ntype User { id: ID! }')).toBe(true);
		});
	});

	describe('extractTypeNames', () => {
		it('should extract type names from definitions', () => {
			const typeDef = `
				type User { id: ID! }
				enum Status { ACTIVE }
				interface Node { id: ID! }
			`;
			const names = extractTypeNames(typeDef);
			expect(names).toEqual(['User', 'Status', 'Node']);
		});

		it('should handle single type definitions', () => {
			const names = extractTypeNames('type User { id: ID! }');
			expect(names).toEqual(['User']);
		});
	});

	describe('deduplicateTypeDefs', () => {
		it('should remove duplicate type definitions', () => {
			const typeDefs = [
				'type User { id: ID! }',
				'type Post { title: String }',
				'type User { id: ID! name: String }', // duplicate User
			];
			
			const result = deduplicateTypeDefs(typeDefs);
			expect(result).toHaveLength(2);
			expect(result[0]).toContain('type User');
			expect(result[1]).toContain('type Post');
		});

		it('should keep all unique types', () => {
			const typeDefs = [
				'type User { id: ID! }',
				'type Post { title: String }',
				'enum Status { ACTIVE }',
			];
			
			const result = deduplicateTypeDefs(typeDefs);
			expect(result).toHaveLength(3);
		});
	});
});