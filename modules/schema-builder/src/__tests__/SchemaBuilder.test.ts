import { SchemaBuilder } from '../SchemaBuilder';
import { CORE_SCALARS, CORE_INTERFACES } from '../fragments';

describe('SchemaBuilder', () => {
	let builder: SchemaBuilder;

	beforeEach(() => {
		builder = new SchemaBuilder();
	});

	it('should create an empty schema', () => {
		expect(builder.build()).toBe('');
	});

	it('should add scalars correctly', () => {
		builder.addScalar('scalar JSON');
		expect(builder.build()).toBe('scalar JSON');
	});

	it('should add types correctly', () => {
		builder.addType(`#graphql
			type User {
				id: ID!
				name: String
			}
		`);
		
		const result = builder.build();
		expect(result).toContain('type User');
		expect(result).toContain('id: ID!');
		expect(result).not.toContain('#graphql');
	});

	it('should maintain correct order of schema elements', () => {
		builder
			.addScalar('scalar JSON')
			.addEnum('enum Status { ACTIVE INACTIVE }')
			.addInterface('interface Node { id: ID! }')
			.addType('type User implements Node { id: ID! name: String }');

		const result = builder.build();
		const lines = result.split('\n\n');
		
		expect(lines[0]).toContain('scalar JSON');
		expect(lines[1]).toContain('enum Status');
		expect(lines[2]).toContain('interface Node');
		expect(lines[3]).toContain('type User');
	});

	it('should handle fragments correctly', () => {
		builder
			.addScalar(CORE_SCALARS)
			.addInterface(CORE_INTERFACES);

		const result = builder.build();
		expect(result).toContain('scalar JSON');
		expect(result).toContain('scalar Date');
		expect(result).toContain('interface Node');
	});

	it('should reset correctly', () => {
		builder.addType('type User { id: ID! }');
		expect(builder.build()).toContain('type User');
		
		builder.reset();
		expect(builder.build()).toBe('');
	});

	it('should handle schema definition', () => {
		builder
			.addType('type Query { user: User }')
			.addType('type User { id: ID! }')
			.setSchema('schema { query: Query }');

		const result = builder.build();
		expect(result).toContain('schema { query: Query }');
	});

	it('should auto-categorize types in addMultiple', () => {
		const typeDefs = [
			'scalar JSON',
			'enum Status { ACTIVE }',
			'interface Node { id: ID! }',
			'type User { id: ID! }',
			'input UserInput { name: String }',
		];

		builder.addMultiple(typeDefs);
		const result = builder.build();

		// Should maintain proper order
		const sections = result.split('\n\n');
		expect(sections[0]).toContain('scalar JSON');
		expect(sections[1]).toContain('enum Status');
		expect(sections[2]).toContain('interface Node');
		expect(sections[3]).toContain('input UserInput');
		expect(sections[4]).toContain('type User');
	});

	it('should create new instances with static create method', () => {
		const newBuilder = SchemaBuilder.create();
		expect(newBuilder).toBeInstanceOf(SchemaBuilder);
		expect(newBuilder).not.toBe(builder);
	});
});