/**
 * Utility functions for GraphQL schema building
 */

/**
 * Combines multiple GraphQL type definition strings into one
 */
export function combineTypeDefs(...typeDefs: string[]): string {
	return typeDefs
		.filter(Boolean)
		.map(def => def.replace(/^#graphql\s*/, '').trim())
		.join('\n\n');
}

/**
 * Creates a GraphQL enum from an array of values
 */
export function createEnum(name: string, values: string[]): string {
	return `#graphql
		enum ${name} {
			${values.join('\n\t\t\t')}
		}
	`;
}

/**
 * Creates a GraphQL union from an array of type names
 */
export function createUnion(name: string, types: string[]): string {
	return `#graphql
		union ${name} = ${types.join(' | ')}
	`;
}

/**
 * Wraps a type definition with the #graphql comment for syntax highlighting
 */
export function gql(strings: TemplateStringsArray, ...values: any[]): string {
	const result = strings.reduce((acc, str, i) => {
		return acc + str + (values[i] || '');
	}, '');
	
	return `#graphql\n${result}`;
}

/**
 * Validates that a GraphQL type definition is properly formatted
 */
export function validateTypeDef(typeDef: string): boolean {
	const cleaned = typeDef.replace(/^#graphql\s*/, '').trim();
	
	// Basic validation - check for common GraphQL keywords
	const keywords = ['type', 'input', 'enum', 'interface', 'union', 'scalar', 'directive', 'schema'];
	return keywords.some(keyword => cleaned.includes(keyword));
}

/**
 * Extracts type names from a GraphQL type definition string
 */
export function extractTypeNames(typeDef: string): string[] {
	const cleaned = typeDef.replace(/^#graphql\s*/, '');
	const typeRegex = /(?:type|input|enum|interface|union|scalar)\s+(\w+)/g;
	const matches = [];
	let match;
	
	while ((match = typeRegex.exec(cleaned)) !== null) {
		matches.push(match[1]);
	}
	
	return matches;
}

/**
 * Removes duplicate type definitions based on type names
 */
export function deduplicateTypeDefs(typeDefs: string[]): string[] {
	const seen = new Set<string>();
	const result: string[] = [];
	
	for (const typeDef of typeDefs) {
		const typeNames = extractTypeNames(typeDef);
		const hasNewType = typeNames.some(name => !seen.has(name));
		
		if (hasNewType) {
			typeNames.forEach(name => seen.add(name));
			result.push(typeDef);
		}
	}
	
	return result;
}