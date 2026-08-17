import { addDays, endOfDay, startOfDay, subDays } from 'date-fns';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { removeSQON, replaceSQON } from '#SQONViewer/utils';
import { withTheme } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';

import AggsGroup from './AggsGroup/index';
import styles from './DatesAgg.module.css';

const dateFromSqon = (dateString) => new Date(dateString);
const toSqonDate = (date) => date.valueOf();

const dateFormat = 'yyyy/MM/dd';
const fieldPlaceholder = dateFormat.toUpperCase();

class DatesAgg extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initializeState(props);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState(this.initializeState(nextProps));
	}

	initializeState = ({ getActiveValue = () => null, stats = {}, enforceStatsMax = false }) => {
		const { fieldName } = this.props;
		const minDate = stats.min && subDays(stats.min, 1);
		const statsMax = stats.max && addDays(stats.max, 1);
		const maxDate = enforceStatsMax ? statsMax : Math.max(Date.now(), statsMax);
		const startFromSqon = getActiveValue({ op: '>=', fieldName });
		const endFromSqon = getActiveValue({ op: '<=', fieldName });

		return {
			minDate,
			maxDate,
			startDate: startFromSqon ? dateFromSqon(startFromSqon) : null,
			endDate: endFromSqon ? dateFromSqon(endFromSqon) : null,
		};
	};

	updateSqon = () => {
		const { startDate, endDate } = this.state;
		const { fieldName, handleDateChange } = this.props;
		if (handleDateChange && fieldName) {
			const content = [
				...(startDate
					? [
						{
							op: '>=',
							content: {
								fieldName,
								value: toSqonDate(startOfDay(startDate)),
							},
						},
					]
					: []),
				...(endDate
					? [
						{
							op: '<=',
							content: {
								fieldName,
								value: toSqonDate(endOfDay(endDate)),
							},
						},
					]
					: []),
			];
			handleDateChange({
				fieldName,
				value: content,
				generateNextSQON: (sqon) =>
					replaceSQON(content.length ? { op: 'and', content } : null, removeSQON(fieldName, sqon)),
			});
		}
	};

	handleDateChange = (limit) => (date) => {
		this.setState({ [`${limit}Date`]: date }, this.updateSqon);
	};

	render() {
		const {
			displayName = 'Date Range',
			facetView = false,
			fieldName,
			theme: {
				components: {
					Aggregations: {
						NoDataContainer: {
							fontColor: themeNoDataFontColor,
							fontSize: themeNoDataFontSize,
						} = emptyObj,
					} = emptyObj,
					Input: { borderColor: themeInputBorderColor, boxShadow: themeInputBoxShadow } = emptyObj,
				} = emptyObj,
			},
			type,
			WrapperComponent,
		} = this.props;
		const { minDate, maxDate, startDate, endDate } = this.state;
		const hasData = minDate && maxDate;

		/** @type {import('react').CSSProperties & Record<`--arranger-dates-agg-${string}`, string | undefined>} */
		const noDataThemeStyle = {
			'--arranger-dates-agg-no-data-font-color': themeNoDataFontColor,
			'--arranger-dates-agg-no-data-font-size': themeNoDataFontSize,
		};

		const dataFields = {
			...(fieldName && { 'data-fieldname': fieldName }),
			...(type && { 'data-type': type }),
		};

		return (
			<AggsGroup
				dataFields={dataFields}
				theme={{
					displayName,
					filtering: false,
					sorting: false,
					WrapperComponent
				}}
			>
				{hasData ? (
					<div className={styles.dateRangeWrapper}>
						<DatePicker
							{...{ minDate, maxDate }}
							aria-label={`Pick start date`}
							className={styles.dateInput}
							closeOnScroll
							dateFormat={dateFormat}
							disabled={!hasData}
							isClearable
							onChange={this.handleDateChange('start')}
							openToDate={startDate || minDate}
							placeholderText={fieldPlaceholder}
							popperClassName={styles.datePickerPopper}
							popperPlacement={facetView ? 'bottom-start' : 'top-start'}
							selected={startDate}
							showMonthDropdown
							showYearDropdown
							todayButton="Select Today"
						/>
						<span className={styles.dateSeparator}>to</span>
						<DatePicker
							{...{ minDate, maxDate }}
							aria-label={`Pick end date`}
							className={styles.dateInput}
							closeOnScroll
							dateFormat={dateFormat}
							disabled={!hasData}
							isClearable
							onChange={this.handleDateChange('end')}
							openToDate={endDate || maxDate}
							placeholderText={fieldPlaceholder}
							popperClassName={styles.datePickerPopper}
							popperPlacement={facetView ? 'bottom-end' : 'top-start'}
							selected={endDate}
							showMonthDropdown
							showYearDropdown
							todayButton="Select Today"
						/>
					</div>
				) : (
					<span
						className={styles.noData}
						style={noDataThemeStyle}
					>
						No data available
					</span>
				)}
			</AggsGroup>
		);
	}
}

export default withTheme(DatesAgg);
