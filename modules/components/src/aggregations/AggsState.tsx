import { debounce, isEqual } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDataContext } from '#DataContext/index.js';
import esToAggTypeMap from '#utils/esToAggTypeMap.js';

import type { AggsStateProps } from './types.js';

export const queryFromAgg = ({ fieldName, type }) =>
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

const AggsState = ({ documentType, facetsConfigs, render }: AggsStateProps) => {
	const [state, setState] = useState<{ aggs: any[]; temp: any[] }>({ aggs: [], temp: [] });
	const prevPropsRef = useRef({ documentType, facetsConfigs });

	const fetchAggsState = useMemo(
		() =>
			debounce(async ({ facetsConfigs }) => {
				try {
					const aggregations = facetsConfigs.aggregations || [];

					setState({
						aggs: aggregations,
						temp: aggregations,
					});
				} catch (error) {
					console.warn(error);
				}
			}, 300),
		[],
	);

	useEffect(() => {
		const prevProps = prevPropsRef.current;
		
		if (
			!(
				isEqual(documentType, prevProps.documentType) &&
				isEqual(facetsConfigs, prevProps.facetsConfigs) &&
				facetsConfigs?.aggregations?.length === state.aggs.length
			)
		) {
			fetchAggsState({ facetsConfigs });
		}

		prevPropsRef.current = { documentType, facetsConfigs };
	}, [documentType, facetsConfigs, state.aggs.length, fetchAggsState]);

	// TODO: this function is broken as we removed Server configs from ES
	// however, leaving this here for documentation and follow-up on what to remove server-side
	// const save = useMemo(
	//   () => debounce(async (state) => {
	//     const { apiFetcher = defaultApiFetcher } = props;
	//     let { data } = await apiFetcher({
	//       endpoint: `/graphql`,
	//       body: {
	//         variables: { state },
	//         query: `
	//           mutation($state: JSON!) {
	//             saveAggsState(
	//               state: $state
	//               documentType: "${documentType}"
	//             ) {
	//               state {
	//                 field
	//                 show
	//                 isActive
	//               }
	//             }
	//           }
	//         `,
	//       },
	//     });

	//     setState({
	//       aggs: data.saveAggsState.state,
	//       temp: data.saveAggsState.state,
	//     });
	//   }, 300),
	//   [documentType]
	// );

	const update = useCallback(({ fieldName, key, value }: { fieldName: string; key: string; value: any }) => {
		setState((prevState) => {
			const agg = prevState.temp.find((x) => x.fieldName === fieldName);
			const index = prevState.temp.findIndex((x) => x.fieldName === fieldName);
			const temp = Object.assign([], prevState.temp, {
				[index]: { ...agg, [key]: value },
			});
			// commented out to study later
			// save(temp);
			return { ...prevState, temp };
		});
	}, []);

	// const saveOrder = useCallback((orderedFields: string[]) => {
	//   const aggs = state.temp;
	//   if (
	//     orderedFields.every((field) => aggs.find((agg) => agg.field === field)) &&
	//     aggs.every((agg) => orderedFields.find((field) => field === agg.field))
	//   ) {
	//     save(sortBy(aggs, (agg) => orderedFields.indexOf(agg.field)));
	//   } else {
	//     console.warn('provided orderedFields are not clean: ', orderedFields);
	//   }
	// }, [state.temp]);

	const { temp } = state;

	return render({
		update,
		aggs: temp.map((agg) => {
			const type = esToAggTypeMap[agg.displayType];

			return {
				...agg,
				type,
				query: queryFromAgg({
					...agg,
					type,
				}),
				isTerms: type === 'Aggregations',
			};
		}),
		// saveOrder,
	});
};

const AggsStateWithData = (props: any) => {
	const dataContext = useDataContext();
	return <AggsState {...props} {...dataContext} />;
};

export default AggsStateWithData;
