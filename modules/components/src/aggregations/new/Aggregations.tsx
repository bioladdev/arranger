import { useEffect, useMemo, useState, type ComponentType } from 'react';

import { css } from '@emotion/react';
import cx from 'classnames';
import { sortBy } from 'lodash-es';

import { withData } from '#DataContext/index.js';
import Loader, { LoaderContainer } from '#Loader/index.js';
import { DEBUG } from '#utils/config.js';
import noopFn, { emptyArrFn, emptyObj, emptyObjFn } from '#utils/noops.js';

import aggComponents from '../aggComponentsMap.js';
import AggsQuery from './AggsQuery.js';
import AggsState from './AggsState.js';
import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { astFromValue, print } from 'graphql';
import esToAggTypeMap from '#utils/esToAggTypeMap.js';

interface AggregationsListDisplayProps {
	aggs: any[];
	componentProps?: any;
	containerRef?: any;
	customFacets?: any[];
	data: any;
	documentType: string;
	extendedMapping: any[];
	getCustomItems: any;
	onValueChange?: any;
	setSQON: any;
	sqon: any;
}

// export const _AggregationsListDisplay = ({
// 	aggs,
// 	componentProps = {
// 		getBooleanAggProps: emptyObjFn,
// 		getDatesAggProps: emptyObjFn,
// 		getRangeAggProps: emptyObjFn,
// 		getTermAggProps: emptyObjFn,
// 	},
// 	containerRef,
// 	customFacets = [],
// 	data,
// 	extendedMapping,
// 	getCustomItems,
// 	documentType,
// 	onValueChange = noopFn,
// 	setSQON,
// 	sqon,
// }: AggregationsListDisplayProps) => {
// 	const aggComponentInstances =
// 		data &&
// 		aggs
// 			.map((agg) => ({
// 				...agg,
// 				...data?.[documentType]?.aggregations?.[agg?.fieldName],
// 				...extendedMapping.find(
// 					(extendedField) => extendedField.fieldName.replaceAll('.', '__') === agg.fieldName,
// 				),
// 				onValueChange: ({ sqon, value }) => {
// 					onValueChange(value);
// 					setSQON(sqon);
// 				},
// 				key: agg.fieldName,
// 				sqon,
// 				containerRef,
// 			}))
// 			.map((agg) => {
// 				const customContent = customFacets.find((x) => x.content.fieldName === agg.fieldName)?.content || {};

// 				return {
// 					...agg,
// 					...customContent,
// 				};
// 			})
// 			.map((agg) => aggComponents[agg.displayType]?.({ ...agg, ...componentProps }));

// 	if (data && aggComponentInstances) {
// 		// sort the list by the index specified for each component to prevent order bumping
// 		const componentListToInsert = sortBy(getCustomItems({ aggs }), 'index');

// 		// go through the list of inserts and inject them by splitting and joining
// 		const inserted = componentListToInsert.reduce((acc, { index, component }) => {
// 			const firstChunk = acc.slice(0, index);
// 			const secondChunk = acc.slice(index, acc.length);
// 			return [...firstChunk, component(), ...secondChunk];
// 		}, aggComponentInstances);

// 		return inserted;
// 	} else {
// 		return (
// 			<Loader
// 				css={css`
// 					height: 100%;
// 					width: 100%;
// 				`}
// 			/>
// 		);
// 	}
// };

const CONFIG_QUERY = gql`
	{
		file {
			configs {
				facets {
					aggregations {
						displayName
						displayType
						fieldName
						isActive
						show
					}
				}
			}
		}
	}
`;

const queryFromAgg = ({ fieldName, type }) =>
	type === 'Aggregations'
		? `
			${fieldName} {
				buckets {
					doc_count
					key_as_string
					key
				}
			}
		`
		: `
			${fieldName} {
				stats {
					max
					min
					count
					avg
					sum
				}
			}
		`;

const createQuery = (aggs) => {
	return gql`query AggregationsQuery {
						file {
							aggregations (
								aggregations_filter_themselves: false
							){
								${aggs.map((x) => {
									// TODO: why on FE?
									const type = esToAggTypeMap[x.displayType];

									const agg = { ...x, type };
									return agg.query || queryFromAgg(agg);
								})}
							}
						}
					}`;
};

// TODO: PRELUDE IT UP

export const Aggregations = () => {
	const client = useApolloClient();
	const { data: configData, loading: configLoading, error: configError } = useQuery(CONFIG_QUERY);
	const [aggsData, setAggsData] = useState(null);
	const [aggsLoading, setAggsLoading] = useState(false);
	const [aggsError, setAggsError] = useState(null);

	useEffect(() => {
		if (!configData) return;
		const aggsConfig = configData.file.configs.facets.aggregations;

		const fetchAggregations = async () => {
			try {
				setAggsLoading(true);
				setAggsError(null);
				const query = createQuery(aggsConfig);
				const { data } = await client.query({ query });
				setAggsData(
					// iterate over facet config and zip it with facet aggregation data
					aggsConfig.map((config) => ({
						...config,
						...data.file.aggregations[config?.fieldName],
					})),
				);
			} catch (err) {
				setAggsError(err);
			} finally {
				setAggsLoading(false);
			}
		};

		fetchAggregations();
	}, [configData, client]);

	return (
		<section>
			<pre>{!aggsLoading && !aggsError && JSON.stringify(aggsData, null, 2)}</pre>
			<div style={{ height: '200px', width: '200px' }}>
				{!aggsLoading &&
					!aggsError &&
					!!aggsData &&
					aggsData.map((agg) => {
						console.log(agg.displayType);
						const Component = aggComponents[agg.displayType];
						return Component ? Component.name : agg.displayType;
					})}
			</div>
		</section>
	);
};
