import type { Client } from '@elastic/elasticsearch/api/new';
import { GraphQLDate } from 'graphql-scalars';
import { GraphQLJSON } from 'graphql-type-json';
import { startCase } from 'lodash-es';
import Parallel from 'paralleljs';

import { SchemaBuilder, CORE_SCALARS, CORE_INTERFACES, CORE_ENUMS, AGGREGATION_TYPES, SET_TYPES, SORT_TYPES, CONFIG_TYPES } from '@arranger/schema-builder';
import { ENV_CONFIG } from '#config/index.js';
import { createConnectionResolvers, saveSet, mappingToFields } from '#mapping/index.js';
import { checkESAlias, getESAliases } from '#mapping/utils/fetchMapping.js';

/**
 * Creates the root GraphQL schema using SchemaBuilder
 */
const createRootSchema = ({ types, rootTypes, scalarTypes }) => {
	const builder = SchemaBuilder.create();

	// Add core schema fragments
	builder
		.addMultiple([
			CORE_SCALARS,
			CORE_INTERFACES, 
			CORE_ENUMS,
			AGGREGATION_TYPES,
			SET_TYPES,
			SORT_TYPES,
			CONFIG_TYPES
		]);

	// Add scalar types
	scalarTypes.forEach(([type]) => {
		builder.addScalar(`#graphql
			scalar ${type}
		`);
	});

	// Add document type enum
	builder.addEnum(`#graphql
		enum DocumentType {
			${types.map(([key, type]) => type.name).join('\n\t\t\t')}
		}
	`);

	// Add query results type
	builder.addType(`#graphql
		type QueryResults {
			total: Int
			hits: [Node]
		}
	`);

	// Add file size type
	builder.addType(`#graphql
		type FileSize {
			value: Float
		}
	`);

	// Add root type with dynamic fields
	const rootFields = [
		'node(id: ID!): Node',
		'viewer: Root',
		'query(query: String, types: [String]): QueryResults',
		'hasValidConfig(documentType: String!, index: String!): Boolean',
		...rootTypes.map(([key]) => `${key}: ${startCase(key).replace(/\s/g, '')}`),
		...types.map(([key, type]) => `${type.name}: ${type.name}`)
	];

	builder.addType(`#graphql
		type Root {
			${rootFields.join('\n\t\t\t')}
		}
	`);

	// Add root type definitions
	rootTypes.forEach(([, type]) => {
		if (type.typeDefs) {
			builder.addType(type.typeDefs);
		}
	});

	// Add mutation type
	builder.addType(`#graphql
		type Mutation {
			saveSet(
				type: DocumentType!
				userId: String
				sqon: JSON!
				path: String!
				sort: [Sort]
				refresh: EsRefresh
			): Set
		}
	`);

	// Add schema definition
	builder.setSchema(`#graphql
		schema {
			query: Root
			mutation: Mutation
		}
	`);

	return builder;
};

export const typeDefs = ({ types, rootTypes, scalarTypes }) => {
	const builder = createRootSchema({ types, rootTypes, scalarTypes });
	
	// Add mapping-generated types
	const mappingTypeDefs = types.map(([key, type]) => mappingToFields({ type, parent: '' }));
	
	// Combine all type definitions
	return [
		builder.build(),
		...mappingTypeDefs
	];
};

const resolveObject = () => ({});

export const resolvers = ({ enableAdmin, types, rootTypes, scalarTypes, getServerSideFilter, setsIndex }) => {
	return {
		JSON: GraphQLJSON,
		Date: GraphQLDate,
		Root: {
			viewer: resolveObject,
			hasValidConfig: async (obj, { documentType, index }, { esClient }: { esClient: Client }) => {
				if (documentType) {
					if (index) {
						const [_, type] = types.find(([name]) => name === documentType) || [];

						// TODO: make this more useful/verbose;
						if (type) {
							try {
								const aliases = await getESAliases(esClient);
								const foundAlias = checkESAlias(aliases, index);

								const isValidIndex = [foundAlias, index].includes(type.index);

								return isValidIndex && Object.keys(type.config).length > 0;
							} catch (err) {
								const message = 'Something went wrong reaching ES';

								ENV_CONFIG.DEBUG_MODE && console.error(message, err.message || err);
								return new Error(message);
							}
						}
						return new Error(`No index was found by the name/alias "${index}"`);
					}

					return new Error(`This endpoint requires an ES index or alias`);
				}

				return new Error(`This endpoint requires a "Document Type"`);
			},
			...[...types, ...rootTypes].reduce((acc, [key, type]) => {
				const accessor = type.name || key;

				return accessor.length > 0
					? {
							...acc,
							[accessor]: resolveObject,
						}
					: acc;
			}, {}),
		},
		...types.reduce(
			(acc, [key, type]) => ({
				...acc,
				...createConnectionResolvers({
					createStateResolvers: 'createState' in type ? type.createState : true,
					enableAdmin,
					getServerSideFilter,
					Parallel,
					type,
				}),
			}),
			{},
		),
		...rootTypes.reduce(
			(acc, [key, type]) => ({
				...acc,
				...(type.resolvers ? { [startCase(key).replace(/\s/g, '')]: type.resolvers } : {}),
			}),
			{},
		),
		...scalarTypes.reduce(
			(acc, [scalar, resolver]) => ({
				...acc,
				[scalar]: resolver,
			}),
			{},
		),
		Mutation: {
			saveSet: saveSet({ getServerSideFilter, setsIndex, types }),
		},
	};
};