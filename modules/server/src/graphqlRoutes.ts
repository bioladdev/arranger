import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import type { Client } from '@elastic/elasticsearch';
import type { Router, Request, Response } from 'express';
import { mergeSchemas } from '@graphql-tools/schema';

import getConfigObject, { ENV_CONFIG, initializeSets } from './config/index.js';
import { ConfigProperties } from './config/types.js';
import { extendColumns, extendFacets, flattenMappingToFields } from './mapping/extendMapping.js';
import { addMappingsToTypes, extendFields, fetchMapping } from './mapping/index.js';
import makeSchema from './schema/index.js';
import { createSchemaFromNetworkConfig } from './network/index.js';

interface GraphQLContext {
	esClient: Client;
	[key: string]: any;
}

const getESMapping = async (esClient: Client, index: string): Promise<Record<string, any>> => {
	if (esClient && index) {
		const { mapping } = await fetchMapping({
			esClient,
			index,
		});

		if (Object.hasOwn(mapping, 'id')) {
			// FIXME: Figure out a solution to map this to something else rather than dropping it
			ENV_CONFIG.DEBUG_MODE &&
				console.log('  Detected reserved field "id" in mapping, dropping it from GraphQL...');
			delete mapping.id;
		}

		console.log('  Success!\n');
		return mapping;
	}

	throw new Error(`Could not get ES mappings for ${index}`);
};

const getTypesWithMappings = async (mapping: Record<string, any>, configs: Record<string, any> = {}): Promise<{ fieldsFromMapping: any[]; typesWithMappings: any }> => {
	if (Object.keys(configs).length > 0) {
		try {
			console.log('Now creating a GraphQL mapping based on the ES index:');

			const fieldsFromMapping = await flattenMappingToFields(mapping);

			// Combines the mapping from ES with the "extended" custom configs
			const extendedFields = await (async () => {
				try {
					return extendFields(fieldsFromMapping, configs?.[ConfigProperties.EXTENDED]);
				} catch (err) {
					console.log(
						'  Something happened while extending the ES mappings.\n' +
							'  Defaulting to "extended" config from files.\n',
					);
					ENV_CONFIG.DEBUG_MODE && console.log(err);

					return configs?.[ConfigProperties.EXTENDED] || [];
				}
			})();

			// Uses the "extended" fields to enhance the "facets" custom configs
			const extendedFacetsConfigs = await (async () => {
				try {
					return extendFacets(configs?.[ConfigProperties.FACETS], extendedFields);
				} catch (err) {
					console.log(
						'  Something happened while extending the column mappings.\n' +
							'  Defaulting to "table" config from files.\n',
					);
					ENV_CONFIG.DEBUG_MODE && console.log(err);

					return configs?.[ConfigProperties.TABLE] || [];
				}
			})();

			// Uses the "extended" fields to enhance the "table" custom configs
			const extendedTableConfigs = await (async () => {
				try {
					return extendColumns(configs?.[ConfigProperties.TABLE], extendedFields);
				} catch (err) {
					console.log(
						'  Something happened while extending the column mappings.\n' +
							'  Defaulting to "table" config from files.\n',
					);
					ENV_CONFIG.DEBUG_MODE && console.log(err);

					return configs?.[ConfigProperties.TABLE] || [];
				}
			})();

			const typesWithMappings = addMappingsToTypes({
				graphQLType: {
					index: configs?.[ConfigProperties.INDEX],
					name: configs?.[ConfigProperties.DOCUMENT_TYPE],
					extendedFields,
					customFields: '',
					config: {
						...configs,
						[ConfigProperties.FACETS]: extendedFacetsConfigs,
						[ConfigProperties.TABLE]: extendedTableConfigs,
					},
				},
				mapping,
			});

			console.log('  Success!\n');
			return {
				fieldsFromMapping,
				typesWithMappings,
			};
		} catch (error) {
			console.error(error?.message || error);
			throw `  Something went wrong while creating the GraphQL mapping${
				ENV_CONFIG.ES_USER && ENV_CONFIG.ES_PASS
					? ', this needs research by an Arranger maintainer!'
					: '.\n  Likely cause: ES Auth parameters may be missing.'
			}`;
		}
	}

	throw Error('  No configs available at getTypesWithMappings');
};

interface CreateSchemaOptions {
	enableAdmin: boolean;
	getServerSideFilter: any;
	graphqlOptions?: { middleware?: any[] };
	setsIndex: string;
	types: any;
}

const createSchema = async ({ enableAdmin, getServerSideFilter, graphqlOptions = {}, setsIndex, types }: CreateSchemaOptions) => {
	const schemaBase = {
		getServerSideFilter,
		rootTypes: [],
		setsIndex,
		types,
	};

	return {
		...(types && {
			mockSchema: makeSchema({
				enableAdmin,
				mock: true,
				...schemaBase,
			}),
			schema: makeSchema({
				enableAdmin,
				middleware: graphqlOptions.middleware || [],
				...schemaBase,
			}),
		}),
	};
};

const noSchemaHandler =
	(endpoint = 'unspecified') =>
	(req: any, res: any) => {
		console.log(`  - Something went wrong initialising a GraphQL endpoint: ${endpoint}`);

		return res.json({
			error: 'Schema is undefined. Make sure your server has a valid GraphQL Schema.',
		});
	};

const createEndpoint = async ({ esClient, graphqlOptions = {}, mockSchema, schema, networkSchema }) => {
	const mainPath = '/graphql';
	const mockPath = '/mock/graphql';
	const router = Router();

	console.log('Starting GraphQL server:');

	try {
		console.log(`  - GraphQL playground available at ...${mainPath}`);

		// TODO: D.R.Y this thing!

		if (schema) {
			const buildContext = async ({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext> => {
				const externalContext =
					typeof graphqlOptions.context === 'function'
						? await graphqlOptions.context(req, res)
						: graphqlOptions.context;

				return {
					esClient,
					...(externalContext || {}),
				};
			};

			const apolloServer = new ApolloServer<GraphQLContext>({
				schema,
			});

			await apolloServer.start();

			router.use(
				mainPath,
				expressMiddleware(apolloServer, {
					context: buildContext,
				})
			);

			console.log(`  - GraphQL endpoint running at ...${mainPath}`);
		} else {
			router.use(mainPath, noSchemaHandler(mainPath));
		}

		if (mockSchema) {
			const apolloMockServer = new ApolloServer<GraphQLContext>({
				schema: mockSchema,
			});

			await apolloMockServer.start();

			router.use(
				mockPath,
				expressMiddleware(apolloMockServer, {
					context: async ({ req, res }) => ({ esClient }),
				})
			);

			console.log(`  - GraphQL mock endpoint running at ...${mockPath}`);
		} else {
			router.use(mockPath, noSchemaHandler(mockPath));
		}

		console.log('  Success!\n');
	} catch (err) {
		ENV_CONFIG.DEBUG_MODE && console.error(err);
		// TODO: Throw better?
		throw err;
	}

	router.use('/', (req, res, next) => {
		// this middleware makes the esClient available in all requests in a "context"
		req.context.schema = schema;
		req.context.mockSchema = mockSchema;

		return next();
	});

	return router;
};

interface CreateSchemasFromConfigsOptions {
	configsSource?: string;
	enableAdmin: boolean;
	enableNetworkAggregation: boolean;
	esClient: Client;
	getServerSideFilter: any;
	graphqlOptions?: Record<string, any>;
	setsIndex: string;
}

export const createSchemasFromConfigs = async ({
	configsSource = '',
	enableAdmin,
	enableNetworkAggregation,
	esClient,
	getServerSideFilter,
	graphqlOptions = {},
	setsIndex,
}: CreateSchemasFromConfigsOptions) => {
	try {
		const configsFromFiles = await getConfigObject(configsSource);
		const mappingFromES = await getESMapping(esClient, configsFromFiles[ConfigProperties.INDEX]);
		const { fieldsFromMapping, typesWithMappings } = await getTypesWithMappings(mappingFromES, configsFromFiles);

		const commonFields = { fieldsFromMapping, typesWithMappings };

		const { mockSchema, schema } = await createSchema({
			enableAdmin,
			getServerSideFilter,
			graphqlOptions,
			setsIndex,
			types: typesWithMappings,
		});

		const schemasToMerge = [schema];

		/**
		 * Federated Network Search
		 */
		if (enableNetworkAggregation) {
			const networkConfigsObj = configsFromFiles[ConfigProperties.NETWORK_AGGREGATION];
			if (!networkConfigsObj || networkConfigsObj?.length === 0) {
				throw Error('Network config not found. Please check validity.');
			}

			const remoteServerConfigs = networkConfigsObj.map((config) => ({
				...config,
				/*
				 * part of the gql schema is generated dynamically
				 * in the case of the "file" field, the field name and gql type name are the same
				 */
				documentName: config.documentType,
			}));
			const networkSchema = await createSchemaFromNetworkConfig({
				networkConfigs: remoteServerConfigs,
			});
			schemasToMerge.push(networkSchema);
		}

		const fullSchema = mergeSchemas({ schemas: schemasToMerge });
		return {
			...commonFields,
			mockSchema,
			schema: fullSchema,
		};
	} catch (error) {
		const message = error?.message || error;
		console.info('\n------\nError thrown while creating the GraphQL schemas.');
		console.error(message);

		throw '  Something went wrong while creating the GraphQL schemas';
	}
};

export default async ({
	configsSource = '',
	enableAdmin,
	enableNetworkAggregation,
	esClient,
	getServerSideFilter,
	graphqlOptions = {},
	setsIndex,
}: CreateSchemasFromConfigsOptions): Promise<any> => {
	try {
		const { fieldsFromMapping, mockSchema, schema, typesWithMappings } = await createSchemasFromConfigs({
			configsSource,
			enableAdmin,
			enableNetworkAggregation,
			esClient,
			getServerSideFilter,
			graphqlOptions,
			setsIndex,
		});

		const graphQLEndpoints = await createEndpoint({
			esClient,
			graphqlOptions,
			mockSchema,
			schema,
		});

		await initializeSets({ esClient, setsIndex });

		return [
			// this middleware makes the esClient and config available in all requests, in a "context" object
			(req, res, next) => {
				req.context = {
					...req.context,
					configs: typesWithMappings?.[1],
					esClient,
					fieldsFromMapping,
				};

				return next();
			},
			graphQLEndpoints,
		];
	} catch (error) {
		const message = error?.message || error;
		// if enpoint creation fails, follow to the next server step to respond with an error
		console.info('\n------\nError thrown while generating the GraphQL endpoints.');
		console.error(message);

		return (req, res) =>
			res.status(500).send({
				// TODO: revisit this response
				detail: 'Please notify the systems admin - ',
				message: message?.trim?.() || 'The GraphQL server is unavailable due to an internal error',
				type: 'system/unspecified-internal-error',
			});
	}
};
