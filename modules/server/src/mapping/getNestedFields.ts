import { flattenDeep } from 'lodash-es';

interface MappingMetadata {
	type?: string;
	properties?: Record<string, MappingMetadata>;
}

const getNestedFields = (mapping: Record<string, MappingMetadata> | undefined, parent = ''): string[] => {
	return flattenDeep(
		Object.entries(mapping || {}).map(([field, metadata]) => {
			const fullPath = parent ? `${parent}.${field}` : field;
			return [metadata.type === 'nested' && fullPath, ...getNestedFields(metadata.properties, fullPath)];
		}),
	).filter(Boolean) as string[];
};

export default getNestedFields;
