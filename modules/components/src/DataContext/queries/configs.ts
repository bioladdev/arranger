import { gql } from '@apollo/client';

export const downloadsConfigs = `
	downloads {
		allowCustomMaxRows
		maxRows
	}
`;

export const facetsConfigs = `
	facets {
		aggregations {
			displayName
			displayType
			fieldName
			isActive
			show
		}
	}
`;

export const tableConfigs = `
	table {
		columns {
			accessor
			canChangeShow
			displayFormat
			displayName
			displayType
			displayValues
			fieldName
			id
			isArray
			jsonPath
			query
			show
			sortable
			type
		}
		defaultSorting {
			desc
			fieldName
		}
		maxResultsWindow
		rowIdFieldName
	}
`;

export const configQuery = (documentType: string) =>
	gql`query ArrangerConfigs {
		${documentType} {
			configs {
				${downloadsConfigs}
				extended
				${facetsConfigs}
				${tableConfigs}
			}
		}
	}`;

export const configs = gql`
	query ($documentType: String!, $index: String!) {
		hasValidConfig(documentType: $documentType, index: $index)
	}
`;
