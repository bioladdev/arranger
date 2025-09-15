import { isEqual } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import defaultApiFetcher from '#utils/api.js';
import esToAggTypeMap from '#utils/esToAggTypeMap.js';
import noopFn, { emptyObj } from '#utils/noops.js';

import AdvancedFacetView from './index.js';

const fetchGraphqlQuery = async ({ query, variables = null, apiFetcher = defaultApiFetcher }) =>
	apiFetcher({
		endpoint: `/graphql`,
		body: {
			query: query,
			variables,
		},
	}).then((data) => data.data);

// TODO: remove dependence on "mapping"
const fetchMappingData = async (fetchConfig) =>
	fetchGraphqlQuery({
		query: `{
      ${fetchConfig.index} {
        configs {
          extended,
          facets {
            aggregations {
				fieldName
				isActive,
            }
          }
        }
        mapping,
      }
    }`,
		...fetchConfig,
	}).then((data) => data[fetchConfig.index]);

const fetchAggregationData = async ({ sqon, extended, index, apiFetcher }) => {
	const fetchConfig = { index, apiFetcher };
	const serializeToGraphQl = (aggName) => aggName.split('.').join('__');
	const serializeToPath = (aggName) => aggName.split('__').join('.');
	const allAggsNames = extended.map((entry) => entry.fieldName).map(serializeToGraphQl);
	const getAggregationQuery = () =>
		allAggsNames
			.map((aggName) => {
				const aggType = extended.find((entry) => serializeToGraphQl(entry.fieldName) === aggName).type;
				return `
          ${aggName} {
            ${esToAggTypeMap[aggType] === 'Aggregations'
						? `buckets { key key_as_string doc_count }`
						: `stats { max min avg sum }`
					}
          }`;
			})
			.join('');
	const query = `
    query ($sqon: JSON){
      ${index} {
        aggregations (
          aggregations_filter_themselves: false
          filters: $sqon
        ) { ${getAggregationQuery()} }
      }
    }`;
	return fetchGraphqlQuery({
		query,
		variables: { sqon },
		...fetchConfig,
	}).then((data) => ({
		aggregations: Object.keys(data[index].aggregations || {}).reduce(
			(agg, key) => ({
				...agg,
				[serializeToPath(key)]: data[index].aggregations[key],
			}),
			{},
		),
	}));
};

const removeFieldTypesFromMapping = ({ mapping, extended, parentField = null, fieldTypesToExclude = [] }) => {
	const output = {
		...Object.entries(mapping).reduce((acc, [key, val]) => {
			const currentFieldName = `${parentField ? `${parentField}.` : ''}${key}`;
			const isId = fieldTypesToExclude.some(
				(type) => type === extended.find((ex) => ex.fieldName === currentFieldName)?.type,
			);
			const toSpread = !isId
				? {
					...(val.properties
						? {
							[key]: {
								...val,
								properties: removeFieldTypesFromMapping({
									mapping: val.properties,
									extended,
									parentField: currentFieldName,
									fieldTypesToExclude,
								}),
							},
						}
						: {
							[key]: val,
						}),
				}
				: {};
			return {
				...acc,
				...toSpread,
			};
		}, {}),
	};
	return output;
};

const defaultFieldTypesToExclude = ['id', 'text'];

interface LiveAdvancedFacetViewProps {
	index: string;
	apiFetcher?: typeof defaultApiFetcher;
	sqon?: any;
	fieldTypesToExclude?: string[];
	onSqonChange?: (args: { sqon: any }) => void;
	documentType: string;
	[key: string]: any;
}

const LiveAdvancedFacetView = ({
	index,
	apiFetcher = defaultApiFetcher,
	sqon: initialSqon,
	fieldTypesToExclude = defaultFieldTypesToExclude,
	onSqonChange = noopFn,
	documentType,
	...props
}: LiveAdvancedFacetViewProps) => {
	const [state, setState] = useState({
		mapping: {},
		extended: [],
		facets: {},
		aggregations: null,
		sqon: initialSqon || null,
	});

	const prevSqonRef = useRef(initialSqon);

	const denyListedAggTypes = useMemo(
		() => ['object', 'nested'].concat(fieldTypesToExclude),
		[fieldTypesToExclude],
	);

	const filterExtendedForFetchingAggs = useCallback(
		({ extended, facets }: { extended: any[]; facets: any }) =>
			extended?.filter(
				(e) =>
					!denyListedAggTypes.includes(e.type) &&
					facets?.aggregations?.find((s) => s.fieldName.split('__').join('.') === e.fieldName)?.isActive,
			),
		[denyListedAggTypes],
	);

	useEffect(() => {
		const fetchConfig = { index, sqon: state.sqon, apiFetcher };
		fetchMappingData(fetchConfig).then(({ configs: { extended, facets } = emptyObj, mapping }) => {
			return fetchAggregationData({
				extended: filterExtendedForFetchingAggs({ extended, facets }),
				...fetchConfig,
			}).then(({ aggregations }) => {
				setState((prev) => ({
					...prev,
					mapping: removeFieldTypesFromMapping({
						mapping,
						extended,
						fieldTypesToExclude,
					}),
					facets,
					extended,
					aggregations,
				}));
			});
		});
	}, [index, apiFetcher, state.sqon, filterExtendedForFetchingAggs, fieldTypesToExclude]);

	useEffect(() => {
		if (!isEqual(initialSqon, prevSqonRef.current)) {
			setState((prev) => ({ ...prev, sqon: initialSqon }));
			prevSqonRef.current = initialSqon;
		}
	}, [initialSqon]);

	const onSqonFieldChange = useCallback(
		({ sqon }: { sqon: any }) => {
			const { extended, facets } = state;

			fetchAggregationData({
				index,
				apiFetcher,
				extended: filterExtendedForFetchingAggs({
					extended,
					facets,
				}),
				sqon,
			}).then(({ aggregations }) => {
				setState((prev) => ({ ...prev, sqon, aggregations }));
				onSqonChange({ sqon });
			});
		},
		[state, index, apiFetcher, filterExtendedForFetchingAggs, onSqonChange],
	);

	return (
		<AdvancedFacetView
			{...props}
			rootTypeName={documentType}
			elasticMapping={state.mapping}
			extendedMapping={state.extended.filter((ex) => !fieldTypesToExclude.some((type) => ex.type === type))}
			aggregations={state.aggregations}
			onSqonFieldChange={onSqonFieldChange}
			sqon={state.sqon}
		/>
	);
};

export default LiveAdvancedFacetView;
