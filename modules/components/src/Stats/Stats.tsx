import type { ComponentType } from 'react';

import { get } from 'lodash-es';
import { Fragment } from 'react';
import Spinner from 'react-spinkit';

import { AggsState } from '#aggregations/index.js';
import Query from '#Query.js';
import formatNumber from '#utils/formatNumber.js';

export const underscoreField = (str: string) => (str || '').split('.').join('__');

export const accessor = ({ aggsField, dataAccessor }: any) =>
	`${underscoreField(aggsField?.fieldName)}.${dataAccessor || (aggsField?.isTerms ? `buckets.length` : `stats.count`)}`;

const constructQuery = ({ documentType, query, resolver = 'aggregations' }: any) => `
	query($sqon: JSON) {
		data: ${documentType} {
			${resolver} (
				filters: $sqon
				${resolver === 'aggregations' ? 'include_missing: false' : ''}
				${resolver === 'aggregations' ? 'aggregations_filter_themselves: true' : ''}
			) {
				${query}
			}
		}
	}
`;

const LoadingSpinner = () => (
	<Spinner
		fadeIn="none"
		name="circle"
		color="#a9adc0"
		style={{
			width: 15,
			height: 15,
			marginRight: 9,
		}}
	/>
);

interface RootQueryProps {
	documentType: string;
	render: any;
	sqon: any;
}

const RootQuery = ({ documentType, render, sqon, ...props }: RootQueryProps) => (
	<Query
		{...props}
		endpointTag="Arranger-StatsRoot"
		query={constructQuery({ documentType, resolver: 'hits', query: 'total' })}
		render={({ data, error, loading, value }) => render({ loading, value: get(data, `data.hits.total`, '') })}
		renderError
		shouldFetch
		variables={{ sqon }}
	/>
);

interface FieldQueryProps {
	aggsState: any;
	dataAccessor?: string;
	documentType: string;
	fieldName: string;
	formatResult?: any;
	render: any;
	sqon: any;
}

const FieldQuery = ({
	aggsState: { aggs },
	fieldName,
	render,
	sqon,
	documentType,
	dataAccessor,
	formatResult = (x: any) => x,
	aggsField = aggs.find((x: any) => x.fieldName === underscoreField(fieldName)),
	...props
}: FieldQueryProps) => (
	<Query
		{...props}
		endpointTag="Arranger-StatsField"
		query={constructQuery({ documentType, query: aggsField?.query })}
		render={({ data, loading }) =>
			render({
				loading,
				value: formatResult(get(data, `data.aggregations.${accessor({ aggsField, dataAccessor })}`, '')),
			})
		}
		renderError
		shouldFetch={aggs.length}
		variables={{ sqon }}
	/>
);

interface StatProps {
	icon?: any;
	isRoot?: boolean;
	label?: string;
	LoadingSpinnerComponent: ComponentType;
	QueryComponent?: ComponentType<any>;
}

const Stat = ({
	icon = '',
	label = '',
	isRoot = false,
	LoadingSpinnerComponent,
	QueryComponent = isRoot ? RootQuery : FieldQuery,
	...props
}: StatProps) => {
	return (
		<div className="stat-container">
			{icon}
			<div className="stat-content">
				<QueryComponent {...props} render={(x) => (x.loading ? <LoadingSpinnerComponent /> : formatNumber(x.value))} />
			</div>
			<div className="stat-label">{label}</div>
		</div>
	);
};

interface StatsProps {
	apiFetcher: any;
	documentType: string;
	LoadingSpinnerComponent?: ComponentType;
	render?: any;
	small?: boolean;
	stats: any[];
	transparent?: boolean;
}

const Stats = ({
	apiFetcher,
	documentType,
	stats,
	className,
	render,
	small,
	transparent,
	LoadingSpinnerComponent = LoadingSpinner,
	...props
}: StatsProps) => (
	<div
		className={`
			stats-container
			${small ? `small` : ``}
			${transparent ? `transparent` : ``}
		`}
		css={`
			display: flex;
			align-items: center;
			${className};
		`}
	>
		<AggsState
			{...{ apiFetcher, documentType }}
			render={(aggsState) =>
				stats.map((stat, i) => (
					<Fragment key={stat.label}>
						{i > 0 && <div key={i} className="stats-line" />}
						<Stat
							{...{
								aggsState,
								apiFetcher,
								documentType,
								LoadingSpinnerComponent,
							}}
							{...props}
							{...stat}
						/>
					</Fragment>
				))
			}
		/>
	</div>
);

export default Stats;
