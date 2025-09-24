import { flattenDeep } from 'lodash-es';

interface MappingField {
	field: string;
	type: string;
}

interface MappingData {
	type?: string;
	properties?: Record<string, MappingData>;
}

const joinWith =
	(s = '.') =>
	(x: string): string =>
		x ? x + s : '';

const flattenMapping = (properties: Record<string, MappingData>, parent = ''): MappingField[] => {
	return flattenDeep(
		Object.entries(properties).map(([field, data]) =>
			!data.properties
				? {
						field: joinWith()(parent) + field,
						type: data.type || 'unknown',
				  }
				: [
						{
							field: joinWith()(parent) + field,
							type: data.type || 'object',
						},
						...flattenMapping(data.properties, joinWith()(parent) + field),
				  ],
		),
	);
};

export default flattenMapping;
