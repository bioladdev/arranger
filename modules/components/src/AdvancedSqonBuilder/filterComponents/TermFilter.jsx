import { useState } from 'react';
import { sortBy, get } from 'lodash-es';

import { TermAggs } from '#aggregations/index';
import Query from '#Query';
import { inCurrentSQON } from '#SQONViewer/utils';
import TextFilter from '#TextFilter/index';
import defaultApiFetcher from '#utils/api';
import noopFn from '#utils/noops';

import { getOperationAtPath, setSqonAtPath, FIELD_OP_DISPLAY_NAME, TERM_OPS, IN_OP, AND_OP } from '../utils';

import { FilterContainer } from './common';
import './FilterContainerStyle.css';

const AggsWrapper = ({ children }) => <div className="aggregation-group">{children}</div>;

const filterStringsCaseInsensitive = (values, searchString, path = null) =>
	values.filter((val) => {
		const valText = path ? get(val, path) : val;
		return -1 !== valText.search(new RegExp(searchString, 'i'));
	});

export const TermFilterUI = (props) => {
	const {
		initialSqon = null,
		onSubmit = (sqon) => { },
		onCancel = noopFn,
		ContainerComponent = FilterContainer,
		InputComponent = TextFilter,
		sqonPath = [],
		buckets,
		fieldDisplayNameMap = {},
		opDisplayNameMap = FIELD_OP_DISPLAY_NAME,
		fieldName,
	} = props;

	const initialFieldSqon = getOperationAtPath(sqonPath)(initialSqon) || {
		op: IN_OP,
		content: { value: [], fieldName },
	};
	const [searchString, setSearchString] = useState('');
	const [localSqon, setLocalSqon] = useState(initialSqon);
	const onSearchChange = (e) => setSearchString(e.value);
	const isFilterActive = (field) =>
		inCurrentSQON({
			value: field.value,
			dotFieldName: field.fieldName,
			currentSQON: getOperationAtPath(sqonPath)(localSqon),
		});
	const getCurrentFieldOp = () => getOperationAtPath(sqonPath)(localSqon);
	const onSqonSubmit = () => onSubmit(localSqon);
	const computeBuckets = (buckets) =>
		sortBy(
			filterStringsCaseInsensitive(buckets, searchString, 'key'),
			(bucket) =>
				!inCurrentSQON({
					value: bucket.key,
					dotFieldName: initialFieldSqon.content.fieldName,
					currentSQON: getOperationAtPath(sqonPath)(initialSqon),
				}),
		);
	const onOptionTypeChange = (e) => {
		const currentFieldSqon = getCurrentFieldOp();
		setLocalSqon(setSqonAtPath(sqonPath, {
			...currentFieldSqon,
			op: e.target.value,
		})(localSqon));
	};
	const onSelectAllClick = () => {
		const currentFieldSqon = getCurrentFieldOp();
		setLocalSqon(setSqonAtPath(sqonPath, {
			...currentFieldSqon,
			content: {
				...currentFieldSqon.content,
				value: filterStringsCaseInsensitive(
					buckets.map(({ key }) => key),
					searchString,
				),
			},
		})(localSqon));
	};
	const onClearClick = () => {
		const currentFieldSqon = getCurrentFieldOp();
		setLocalSqon(setSqonAtPath(sqonPath, {
			...currentFieldSqon,
			content: {
				...currentFieldSqon.content,
				value: [],
			},
		})(localSqon));
	};
	const onFilterClick = ({ generateNextSQON }) => {
		setTimeout(() => {
			// state change in the same tick somehow results in this component dismounting (probably  something to do with TermAggs' click event, needs investigation)
			const deltaSqon = generateNextSQON();
			const deltaFiterObjContentValue = deltaSqon.content[0].content.value;
			// we're only interested in the new field operation's content value
			setLocalSqon((prev) => {
				const currentFieldSqon = getOperationAtPath(sqonPath)(prev);
				const existingValue = (currentFieldSqon.content.value || []).find((v) => deltaFiterObjContentValue.includes(v));
				const newFieldSqon = {
					...currentFieldSqon,
					content: {
						...currentFieldSqon.content,
						value: [
							...(currentFieldSqon.content.value || []).filter((v) => v !== existingValue),
							...(existingValue ? [] : deltaFiterObjContentValue),
						],
					},
				};
				return setSqonAtPath(sqonPath, newFieldSqon)(prev);
			});
		}, 0);
	};
	return (
		<ContainerComponent onSubmit={onSqonSubmit} onCancel={onCancel}>
			<div className="contentSection">
				<span>{fieldDisplayNameMap[initialFieldSqon.content.fieldName] || initialFieldSqon.content.fieldName}</span>{' '}
				is{' '}
				<span className="select">
					<select onChange={onOptionTypeChange} value={getCurrentFieldOp().op}>
						{TERM_OPS.map((option) => (
							<option key={option} value={option}>
								{opDisplayNameMap[option]}
							</option>
						))}
					</select>
				</span>
			</div>
			<div className="contentSection searchInputContainer">
				<InputComponent value={searchString} onChange={onSearchChange} />
			</div>
			<div className="contentSection termFilterActionContainer">
				<span className={`aggsFilterAction selectAll`} onClick={onSelectAllClick}>
					Select All
				</span>
				<span className={`aggsFilterAction clear`} onClick={onClearClick}>
					Clear
				</span>
			</div>
			<div className="contentSection termAggsContainer">
				<TermAggs
					WrapperComponent={AggsWrapper}
					field={initialFieldSqon.content.field}
					displayName="Disease Type"
					buckets={computeBuckets(buckets)}
					handleValueClick={onFilterClick}
					isActive={isFilterActive}
					maxTerms={5}
				/>
			</div>
		</ContainerComponent>
	);
};

const TermFilter = (props) => {
	const {
		fieldName,
		arrangerIndex,
		apiFetcher = defaultApiFetcher,
		executableSqon = {
			op: AND_OP,
			content: [],
		},

		initialSqon = null,
		onSubmit = (sqon) => { },
		onCancel = () => { },
		ContainerComponent = FilterContainer,
		InputComponent = TextFilter,
		sqonPath = [],
		fieldDisplayNameMap = {},
		opDisplayNameMap = FIELD_OP_DISPLAY_NAME,
	} = props;

	const gqlField = fieldName.split('.').join('__');
	const query = `
		query($sqon: JSON){
			${arrangerIndex} {
				aggregations(filters: $sqon) {
					${gqlField} {
						buckets {
							key
							doc_count
						}
					}
				}
			}
		}`;

	return (
		<Query
			variables={{ sqon: executableSqon }}
			apiFetcher={apiFetcher}
			query={query}
			render={({ data, loading, error }) => (
				<TermFilterUI
					ContainerComponent={({ children, ...props }) => (
						<ContainerComponent {...props} loading={loading}>
							{children}
						</ContainerComponent>
					)}
					fieldName={fieldName}
					initialSqon={initialSqon}
					onSubmit={onSubmit}
					onCancel={onCancel}
					InputComponent={InputComponent}
					sqonPath={sqonPath}
					fieldDisplayNameMap={fieldDisplayNameMap}
					opDisplayNameMap={opDisplayNameMap}
					buckets={data ? get(data, `${arrangerIndex}.aggregations.${gqlField}.buckets`) : []}
				/>
			)}
		/>
	);
};

export default TermFilter;
