import { JSONPath } from 'jsonpath-plus';
import { capitalize, flatMap, isArray, isEmpty } from 'lodash-es';
import { useMemo } from 'react';

import Query from '#Query.js';
import { DEBUG } from '#utils/config.js';
import splitString from '#utils/splitString.js';

const isValidValue = (value) => value?.trim()?.length > 1;

export const decorateFieldWithColumnsState = ({ tableConfigs, fieldName }) => {
	if (fieldName) {
		const columnsStateField =
			tableConfigs?.columns?.find((column) => column.fieldName === fieldName) ||
			tableConfigs?.columns?.find((column) => column.fieldName === tableConfigs.rowIdFieldName) ||
			{};

		const splitFieldName = fieldName?.split?.('.');

		return {
			...columnsStateField,
			gqlField: splitFieldName.join('__'),
			jsonPath: `$..${splitFieldName?.length === 1 ? fieldName : splitFieldName.slice(-1)}`,
			query: columnsStateField.query || fieldName,
		};
	}

	DEBUG && console.info('Could not find fieldName to use for QuickSearch');

	return null;
};

const isMatching = ({ value = '', searchText = '', exact = false, who }) => {
	return exact ? value === searchText : value.toLowerCase().includes(searchText.toLowerCase());
};

interface QuickSearchQueryProps {
	apiFetcher?: any;
	displayField?: any;
	documentType: string;
	exact?: boolean;
	isNewSearch?: boolean;
	mapResults?: (props: any) => any;
	queryCallback?: (result: any) => void;
	render: (props: any) => React.ReactNode;
	searchFields?: any[];
	searchLowercase?: boolean;
	searchResultsByEntity?: any[];
	searchText: string;
	searchTextDelimiters?: string[];
	size?: number;
}

const QuickSearchQuery = ({
	apiFetcher,
	displayField,
	documentType,
	exact = false,
	isNewSearch = false,
	mapResults = () => ({}),
	queryCallback,
	render,
	searchFields = [],
	searchLowercase = false,
	searchResultsByEntity: givenSearchResultsByEntity,
	searchText,
	searchTextDelimiters = [],
	size = 5,
}: QuickSearchQueryProps) => {
	const searchTextParts = useMemo(
		() =>
			splitString({
				split: searchTextDelimiters,
				str: searchText,
			}).map((part) => (searchLowercase ? part.toLowerCase() : part)),
		[searchText, searchTextDelimiters, searchLowercase],
	);

	const sqon = useMemo(
		() => ({
			content: exact
				? searchFields?.map(({ fieldName }) => ({
						content: {
							fieldName,
							value: searchTextParts,
						},
						op: 'in',
				  }))
				: searchTextParts.map((part) => ({
						content: {
							fieldNames: searchFields?.map((field) => field.fieldName || field),
							value: `*${part}*`,
						},
						op: 'filter',
				  })),
			op: 'or',
		}),
		[exact, searchFields, searchTextParts],
	);

	const query = useMemo(
		() => `query ${capitalize(documentType)}QuickSearchResults($sqon: JSON, $size: Int) {
			${documentType} {
				hits(filters: $sqon, first: $size) {
				total
				edges {
					node {
					${!isEmpty(displayField?.query) ? `primaryKey: ${displayField?.query}` : ''}
					${
						searchFields
							?.filter?.((field) => field.gqlField && field.query)
							.map?.((field) => `${field.gqlField}: ${field.query}`)
							.join?.('\n') || ''
					}
					}
				}
				}
			}
			}
		`,
		[documentType, displayField, searchFields],
	);

	return (
		<Query
			apiFetcher={apiFetcher}
			callback={queryCallback}
			debounceTime={300}
			endpointTag="Arranger-QuickSearch"
			query={query}
			shouldFetch={isValidValue(searchText) && searchFields.length > 0}
			variables={{ size, sqon }}
			render={({ data, loading }) => {
				const searchResultsByEntity =
					givenSearchResultsByEntity ||
					searchFields?.map((field) => {
						return {
							...field,
							results: data?.[documentType]?.hits?.edges
								?.map(({ node }) => {
									const primaryKey =
										typeof node.primaryKey === 'string'
											? node.primaryKey
											: JSONPath({
													json: node.primaryKey,
													path: displayField.jsonPath,
											  })[0];
									const result =
										field?.jsonPath &&
										JSONPath({
											json: node,
											path: field.jsonPath,
										});

									return {
										primaryKey,
										entityName: field.entityName,
										...searchTextParts?.reduce(
											(acc, part) => {
												if (isArray(result)) {
													const r = result.find((value) => {
														return value ? isMatching({ value, searchText: part, exact }) : value;
													});

													if (r) {
														return { input: part, result: r };
													}
													return acc;
												}

												if (result && isMatching({ value: result, searchText: part, exact })) {
													return { input: part, result };
												}

												return acc;
											},
											{ input: '', result: '' },
										),
									};
								})
								?.filter((x) => isValidValue(searchText) && x.input),
						};
					}) ||
					[];

				const searchResults = flatMap(
					searchResultsByEntity
						?.filter((value) => value?.results?.length)
						?.map(({ entityName, field, results }) =>
							results?.map(({ input, primaryKey, result }) => ({
								entityName,
								field,
								input,
								primaryKey,
								result,
							})),
						),
				);

				const props = {
					apiFetcher,
					loading: isNewSearch || loading,
					results: searchResults,
					resultsByEntity: searchResultsByEntity,
					searchTextParts,
					sqon,
				};

				return render({ ...props, ...mapResults(props) });
			}}
		/>
	);
};

export default QuickSearchQuery;
