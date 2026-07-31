import { useState } from 'react';
import { get } from 'lodash-es';
import PropTypes from 'prop-types';

import { BooleanAggs } from '#aggregations/index';
import Query from '#Query';
import defaultApiFetcher from '#utils/api';

import { getOperationAtPath, setSqonAtPath, IN_OP } from '../utils';

import { FilterContainer } from './common';
import './FilterContainerStyle.css';

const getFieldDisplayName = (fieldDisplayNameMap, initialFieldSqon) => {
	return fieldDisplayNameMap[initialFieldSqon.content.fieldName] || initialFieldSqon.content.fieldName;
};

const AggsWrapper = ({ children }) => <div className="aggregation-group">{children}</div>;

export const BooleanFilterUI = (props) => {
	const {
		onSubmit = (sqon) => { },
		onCancel = () => { },
		ContainerComponent = FilterContainer,
		sqonPath = [],
		initialSqon = {},
		fieldName,
		fieldDisplayNameMap = {},
		buckets = [],
	} = props;

	const [localSqon, setLocalSqon] = useState(initialSqon);

	const initialFieldSqon = getOperationAtPath(sqonPath)(initialSqon) || {
		op: IN_OP,
		content: { fieldName, value: [] },
	};

	const onSqonSubmit = () => onSubmit(localSqon);

	const onSelectionChange = ({ value }) => {
		setTimeout(() => {
			const newOp = {
				op: IN_OP,
				content: {
					fieldName,
					value: [value.key_as_string],
				},
			};
			setLocalSqon((prev) => setSqonAtPath(sqonPath, newOp)(prev));
		}, 0);
	};

	const isActive = ({ value }) => {
		const op = getOperationAtPath(sqonPath)(localSqon);
		return value === (op && op.content.value[0]);
	};

	const fieldDisplayName = getFieldDisplayName(fieldDisplayNameMap, initialFieldSqon);

	return (
		<ContainerComponent onSubmit={onSqonSubmit} onCancel={onCancel}>
			<>
				<div key="header" className="contentSection headerContainer">
					<span>{`${fieldDisplayName}?`}</span>
				</div>
				<div key="body" className="contentSection bodyContainer">
					<BooleanAggs
						WrapperComponent={AggsWrapper}
						fieldName={initialFieldSqon.content.fieldName}
						displayName={fieldDisplayName}
						buckets={buckets}
						defaultDisplayKeys={{
							true: 'Yes',
							false: 'No',
						}}
						handleValueClick={onSelectionChange}
						isActive={isActive}
					/>
				</div>
			</>
		</ContainerComponent>
	);
};

BooleanFilterUI.propTypes = {
	onSubmit: PropTypes.func,
	onCancel: PropTypes.func,
	ContainerComponent: PropTypes.func,
	sqonPath: PropTypes.array,
	initialSqon: PropTypes.object,
	fieldName: PropTypes.string.isRequired,
	fieldDisplayNameMap: PropTypes.object,
	buckets: PropTypes.array,
};

const BooleanFilter = (props) => {
	const {
		apiFetcher = defaultApiFetcher,
		arrangerIndex,
		initialSqon,
		executableSqon,
		sqonPath,
		fieldName,
		onSubmit,
		onCancel,
		fieldDisplayNameMap,
		opDisplayNameMap,
		ContainerComponent,
	} = props;

	const gqlField = fieldName.split('.').join('__');
	const query = `
		query($sqon: JSON){
			${arrangerIndex} {
				aggregations(filters: $sqon) {
					${gqlField} {
						buckets {
							key
							key_as_string
							doc_count
						}
					}
				}
			}
		}`;
	return (
		<Query
			apiFetcher={apiFetcher}
			query={query}
			variables={{ sqon: executableSqon }}
			render={({ data, loading, error }) => (
				<BooleanFilterUI
					ContainerComponent={({ children, ...props }) => (
						<ContainerComponent {...props} loading={loading}>
							{children}
						</ContainerComponent>
					)}
					fieldName={fieldName}
					initialSqon={initialSqon}
					onSubmit={onSubmit}
					onCancel={onCancel}
					sqonPath={sqonPath}
					fieldDisplayNameMap={fieldDisplayNameMap}
					opDisplayNameMap={opDisplayNameMap}
					buckets={data ? get(data, `${arrangerIndex}.aggregations.${gqlField}.buckets`) : []}
				/>
			)}
		/>
	);
};

export default BooleanFilter;
