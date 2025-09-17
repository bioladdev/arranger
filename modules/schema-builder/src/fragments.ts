/**
 * Common GraphQL schema fragments that can be reused across different schemas
 */

export const CORE_SCALARS = `#graphql
	scalar JSON
	scalar Date
`;

export const CORE_INTERFACES = `#graphql
	interface Node {
		id: ID!
	}
`;

export const CORE_ENUMS = `#graphql
	enum EsRefresh {
		TRUE
		FALSE
		WAIT_FOR
	}
`;

export const PAGINATION_TYPES = `#graphql
	type PageInfo {
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
		startCursor: String
		endCursor: String
	}

	type Connection {
		edges: [Edge]
		pageInfo: PageInfo!
		totalCount: Int
	}

	type Edge {
		node: Node
		cursor: String!
	}
`;

export const QUERY_TYPES = `#graphql
	type QueryResults {
		total: Int
		hits: [Node]
	}

	type FileSize {
		value: Float
	}
`;

export const SORT_TYPES = `#graphql
	enum Missing {
		first
		last
	}

	enum Mode {
		avg
		max
		min
		sum
	}

	enum Order {
		asc
		desc
	}

	input Sort {
		fieldName: String!
		order: Order
		mode: Mode
		missing: Missing
	}
`;

export const AGGREGATION_TYPES = `#graphql
	type Stats {
		max: Float
		min: Float
		count: Int
		avg: Float
		sum: Float
	}

	type Bucket {
		doc_count: Int
		key: String
		key_as_string: String
		top_hits(_source: [String], size: Int): JSON
		filter_by_term(filter: JSON): JSON
	}

	type NumericAggregations {
		stats: Stats
		histogram(interval: Float): Aggregations
	}

	type Aggregations {
		bucket_count: Int
		buckets(max: Int): [Bucket]
		cardinality(precision_threshold: Int): Int
	}
`;

export const SET_TYPES = `#graphql
	type Set {
		setId: String
		createdAt: Date
		ids: [String]
		path: String
		size: Int
		sqon: JSON
		type: String
		userId: String
	}
`;

export const CONFIG_TYPES = `#graphql
	type AggregationMapping {
		displayName: String
		displayType: String
		fieldName: String
		isActive: Boolean
		show: Boolean
		type: String
			@deprecated(
				reason: "This field is deprecated in favour of displayType. Projects created with v0.4.6 will return null for this query"
			)
	}

	type FacetsConfig {
		aggregations: [AggregationMapping]
	}

	type ColumnMapping {
		accessor: String
		canChangeShow: Boolean
		displayFormat: String
		displayName: String
		displayType: String
		displayValues: JSON
		fieldName: String
		id: String
		isArray: Boolean
		jsonPath: String
		query: String
		show: Boolean
		sortable: Boolean
		type: String
			@deprecated(
				reason: "This field is deprecated in favour of displayType. Projects created with v3.0.0 will return null for this query"
			)
	}

	type ColumnSorting {
		fieldName: String
		desc: Boolean
	}

	type TableConfig {
		columns: [ColumnMapping]
		defaultSorting: [ColumnSorting]
		maxResultsWindow: Int
		rowIdFieldName: String
	}

	type DownloadsConfig {
		allowCustomMaxRows: Boolean
		maxRows: Int
	}

	type MatchBoxMapping {
		displayName: String
		fieldName: String
		isActive: Boolean
		keyFieldName: String
		searchFieldNames: [String]
	}

	type ConfigsWithState {
		facets: FacetsConfig
		downloads: DownloadsConfig
		extended(fieldNames: [String]): JSON
		matchbox: [MatchBoxMapping]
		table: TableConfig
	}

	type ConfigsWithoutState {
		downloads: DownloadsConfig
		extended(fieldNames: [String]): JSON
	}
`;