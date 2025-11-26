import type { ComponentType } from 'react';

import { css } from '@emotion/react';
import cx from 'classnames';
import { sortBy } from 'lodash-es';

import { withData } from '#DataContext/index.js';
import Loader, { LoaderContainer } from '#Loader/index.js';
import { DEBUG } from '#utils/config.js';
import noopFn, { emptyArrFn, emptyObj, emptyObjFn } from '#utils/noops.js';

import aggComponents from './aggComponentsMap.js';
import AggsQuery from './AggsQuery.js';
import AggsState from './AggsState.js';

interface BaseWrapperProps {}

const BaseWrapper = ({ className, ...props }: BaseWrapperProps) => (
	<section
		css={css`
			height: 100%;
			width: 100%;
		`}
		{...props}
		className={cx('aggregations', className)}
	/>
);

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

export const AggregationsListDisplay = ({
	aggs,
	componentProps = {
		getBooleanAggProps: emptyObjFn,
		getDatesAggProps: emptyObjFn,
		getRangeAggProps: emptyObjFn,
		getTermAggProps: emptyObjFn,
	},
	containerRef,
	customFacets = [],
	data,
	extendedMapping,
	getCustomItems,
	documentType,
	onValueChange = noopFn,
	setSQON,
	sqon,
}: AggregationsListDisplayProps) => {
	const aggComponentInstances =
		data &&
		aggs
			.map((agg) => ({
				...agg,
				...data?.[documentType]?.aggregations?.[agg?.fieldName],
				...extendedMapping.find((extendedField) => extendedField.fieldName.replaceAll('.', '__') === agg.fieldName),
				onValueChange: ({ sqon, value }) => {
					onValueChange(value);
					setSQON(sqon);
				},
				key: agg.fieldName,
				sqon,
				containerRef,
			}))
			.map((agg) => {
				const customContent = customFacets.find((x) => x.content.fieldName === agg.fieldName)?.content || {};

				return {
					...agg,
					...customContent,
				};
			})
			.map((agg) => aggComponents[agg.displayType]?.({ ...agg, ...componentProps }));

	if (data && aggComponentInstances) {
		// sort the list by the index specified for each component to prevent order bumping
		const componentListToInsert = sortBy(getCustomItems({ aggs }), 'index');

		// go through the list of inserts and inject them by splitting and joining
		const inserted = componentListToInsert.reduce((acc, { index, component }) => {
			const firstChunk = acc.slice(0, index);
			const secondChunk = acc.slice(index, acc.length);
			return [...firstChunk, component(), ...secondChunk];
		}, aggComponentInstances);

		return inserted;
	} else {
		return (
			<Loader
				css={css`
					height: 100%;
					width: 100%;
				`}
			/>
		);
	}
};

interface AggregationsListProps {
	aggs?: any[];
	apiFetcher: any;
	componentProps?: any;
	containerRef?: any;
	customFacets?: any[];
	debounceTime?: number;
	documentType: string;
	extendedMapping: any[];
	getCustomItems?: any;
	isLoadingConfigs?: boolean;
	onValueChange?: any;
	setSQON: any;
	sqon: any;
}

export const AggregationsList = ({
	aggs = [],
	apiFetcher,
	componentProps = {
		getBooleanAggProps: emptyObjFn,
		getDatesAggProps: emptyObjFn,
		getRangeAggProps: emptyObjFn,
		getTermAggProps: emptyObjFn,
	},
	containerRef,
	customFacets,
	debounceTime = 300,
	documentType,
	extendedMapping,
	getCustomItems = emptyArrFn, // ({ aggs }) => Array<{index: number, component: Component | Function}>
	isLoadingConfigs,
	onValueChange = noopFn,
	setSQON,
	sqon,
}: AggregationsListProps) => (
	<AggsQuery
		aggs={aggs}
		apiFetcher={apiFetcher}
		debounceTime={debounceTime}
		documentType={documentType}
		render={({ data, loading, error }) => {
			DEBUG && error && console.error(error);

			return (
				<LoaderContainer
					css={css`
						height: 100%;
						width: 100%;
					`}
					disabled={true} // TODO: implement with theme
					isLoading={isLoadingConfigs || loading}
				>
					{AggregationsListDisplay({
						aggs,
						componentProps,
						containerRef,
						customFacets,
						data,
						extendedMapping,
						getCustomItems,
						documentType,
						onValueChange,
						setSQON,
						sqon,
					})}
				</LoaderContainer>
			);
		}}
		sqon={sqon}
	/>
);

interface AggregationsProps {
	apiFetcher: any;
	componentProps?: any;
	containerRef?: any;
	customFacets?: any[];
	documentType?: string;
	extendedMapping: any[];
	isLoadingConfigs?: boolean | string;
	onValueChange?: any;
	setSQON?: any;
	sqon?: any;
	style?: any;
	Wrapper?: ComponentType<any>;
}

const Aggregations = ({
	apiFetcher,
	className = '',
	componentProps = {
		getTermAggProps: emptyObjFn,
		getRangeAggProps: emptyObjFn,
		getBooleanAggProps: emptyObjFn,
		getDatesAggProps: emptyObjFn,
	},
	containerRef = null,
	customFacets = [],
	documentType = '',
	extendedMapping,
	isLoadingConfigs = "false",
	onValueChange = noopFn,
	setSQON = noopFn,
	sqon = null,
	style = emptyObj,
	Wrapper = BaseWrapper,
}: AggregationsProps) => {
	return (
		<Wrapper className={className} style={style}>
			<AggsState
				apiFetcher={apiFetcher}
				documentType={documentType}
				render={(aggsState) => {
					const aggs = aggsState.aggs.filter((agg) => agg.show);

					return AggregationsList({
						aggs,
						apiFetcher,
						componentProps,
						containerRef,
						customFacets,
						documentType,
						extendedMapping,
						isLoadingConfigs,
						onValueChange,
						setSQON,
						sqon,
					});
				}}
			/>
		</Wrapper>
	);
};

export default withData(Aggregations);
