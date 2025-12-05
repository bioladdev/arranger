import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import TermAggs from './index';
import {
	specimenTypeBuckets,
	fileTypeBuckets,
	vitalStatusBuckets,
	geneSymbolBuckets,
	diagnosisBuckets,
	primarySiteBuckets,
	dataStrategyBuckets,
	emptyBuckets,
} from '../mockData';

/**
 * TermAggs component - Term-based aggregation filter
 *
 * TermAggs provides a faceted search interface for categorical data with:
 * - Checkable items with document counts
 * - Search/filter functionality
 * - Alphabetical sorting
 * - Show More/Less pagination
 * - Include/Exclude toggle
 * - Empty state handling
 */
const meta = {
	title: 'Components/Aggregations/TermAggs',
	component: TermAggs,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		displayName: {
			control: 'text',
			description: 'Display name for the aggregation',
		},
		fieldName: {
			control: 'text',
			description: 'Field name from the data source',
		},
		buckets: {
			control: 'object',
			description: 'Array of bucket data with key and doc_count',
		},
		maxTerms: {
			control: 'number',
			description: 'Maximum number of terms to show initially',
		},
		showExcludeOption: {
			control: 'boolean',
			description: 'Show Include/Exclude toggle',
		},
	},
} satisfies Meta<typeof TermAggs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default TermAggs
 * Basic term aggregation with specimen types
 */
export const Default: Story = {
	args: {
		displayName: 'Specimen Type',
		fieldName: 'specimens__specimen_type',
		buckets: specimenTypeBuckets,
		maxTerms: 5,
	},
};

/**
 * With Active Selections
 * Shows items in checked state
 */
export const WithActiveSelections: Story = {
	render: () => {
		const [selectedValues, setSelectedValues] = useState<Set<string>>(
			new Set(['Primary Tumor', 'Normal']),
		);

		return (
			<div style={{ maxWidth: '400px' }}>
				<TermAggs
					displayName="Specimen Type"
					fieldName="specimens__specimen_type"
					buckets={specimenTypeBuckets}
					maxTerms={5}
					isActive={({ value }) => selectedValues.has(value)}
					handleValueClick={({ value }) => {
						const newSelected = new Set(selectedValues);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setSelectedValues(newSelected);
					}}
				/>
			</div>
		);
	},
};

/**
 * Long List with More/Less
 * Shows pagination with "Show More" functionality
 */
export const LongList: Story = {
	render: () => {
		const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

		return (
			<div style={{ maxWidth: '400px' }}>
				<TermAggs
					displayName="Gene Symbol"
					fieldName="genes__gene_symbol"
					buckets={geneSymbolBuckets}
					maxTerms={5}
					isActive={({ value }) => selectedValues.has(value)}
					handleValueClick={({ value }) => {
						const newSelected = new Set(selectedValues);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setSelectedValues(newSelected);
					}}
				/>
			</div>
		);
	},
};

/**
 * With Search Active
 * Shows filtering by search term
 */
export const WithSearchActive: Story = {
	render: () => {
		const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

		return (
			<div style={{ maxWidth: '400px' }}>
				<div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5' }}>
					<strong>Try it:</strong> Click the search icon and filter by "Carcinoma"
				</div>
				<TermAggs
					displayName="Diagnosis"
					fieldName="diagnoses__diagnosis"
					buckets={diagnosisBuckets}
					maxTerms={5}
					searchPlaceholder="Search diagnosis..."
					isActive={({ value }) => selectedValues.has(value)}
					handleValueClick={({ value }) => {
						const newSelected = new Set(selectedValues);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setSelectedValues(newSelected);
					}}
				/>
			</div>
		);
	},
};

/**
 * Alphabetical Sort
 * Interactive sorting toggle
 */
export const AlphabeticalSort: Story = {
	render: () => {
		const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

		return (
			<div style={{ maxWidth: '400px' }}>
				<div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5' }}>
					<strong>Try it:</strong> Click the sort icon to toggle alphabetical sorting
				</div>
				<TermAggs
					displayName="Primary Site"
					fieldName="donors__primary_site"
					buckets={primarySiteBuckets}
					maxTerms={10}
					isActive={({ value }) => selectedValues.has(value)}
					handleValueClick={({ value }) => {
						const newSelected = new Set(selectedValues);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setSelectedValues(newSelected);
					}}
				/>
			</div>
		);
	},
};

/**
 * With Include/Exclude Toggle
 * Shows the exclude option for inverting selections
 */
export const WithIncludeExclude: Story = {
	render: () => {
		const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set(['Alive']));
		const [isExclude, setIsExclude] = useState(false);

		return (
			<div style={{ maxWidth: '400px' }}>
				<div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5' }}>
					<strong>Try it:</strong> Select items and toggle between Include/Exclude
				</div>
				<TermAggs
					displayName="Vital Status"
					fieldName="donors__vital_status"
					buckets={vitalStatusBuckets}
					maxTerms={5}
					showExcludeOption={true}
					isActive={({ value }) => selectedValues.has(value)}
					isExclude={() => isExclude}
					handleValueClick={({ value }) => {
						const newSelected = new Set(selectedValues);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setSelectedValues(newSelected);
					}}
					handleIncludeExcludeChange={({ isExclude: newIsExclude }) => {
						setIsExclude(newIsExclude);
					}}
				/>
			</div>
		);
	},
};

/**
 * Empty State
 * Shows "No data available" message
 */
export const EmptyState: Story = {
	args: {
		displayName: 'No Results',
		fieldName: 'empty_field',
		buckets: emptyBuckets,
		maxTerms: 5,
	},
};

/**
 * Small Dataset
 * Shows behavior when dataset is smaller than maxTerms
 */
export const SmallDataset: Story = {
	render: () => {
		const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

		return (
			<div style={{ maxWidth: '400px' }}>
				<TermAggs
					displayName="Data Strategy"
					fieldName="files__data_strategy"
					buckets={dataStrategyBuckets}
					maxTerms={10}
					isActive={({ value }) => selectedValues.has(value)}
					handleValueClick={({ value }) => {
						const newSelected = new Set(selectedValues);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setSelectedValues(newSelected);
					}}
				/>
			</div>
		);
	},
};

/**
 * Fully Interactive
 * Complete example with all features working together
 */
export const FullyInteractive: Story = {
	render: () => {
		const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set(['BAM', 'VCF']));
		const [isExclude, setIsExclude] = useState(false);

		return (
			<div style={{ maxWidth: '400px' }}>
				<div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5' }}>
					<strong>Fully Interactive Example</strong>
					<div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
						• Click items to select/deselect
						<br />
						• Use search to filter
						<br />
						• Toggle alphabetical sort
						<br />
						• Switch between Include/Exclude
						<br />• Click "More" to expand list
					</div>
				</div>
				<TermAggs
					displayName="File Type"
					fieldName="files__file_type"
					buckets={fileTypeBuckets}
					maxTerms={5}
					showExcludeOption={true}
					searchPlaceholder="Search file types..."
					isActive={({ value }) => selectedValues.has(value)}
					isExclude={() => isExclude}
					handleValueClick={({ value }) => {
						const newSelected = new Set(selectedValues);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setSelectedValues(newSelected);
					}}
					handleIncludeExcludeChange={({ isExclude: newIsExclude }) => {
						setIsExclude(newIsExclude);
					}}
				/>
				<div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', fontSize: '0.85rem' }}>
					<strong>Current Selection:</strong>
					<div>
						Mode: {isExclude ? 'Exclude' : 'Include'}
						<br />
						Selected: {selectedValues.size > 0 ? Array.from(selectedValues).join(', ') : 'None'}
					</div>
				</div>
			</div>
		);
	},
};

/**
 * Multiple Aggregations
 * Shows multiple term aggregations stacked
 */
export const MultipleAggregations: Story = {
	render: () => {
		const [specimenSelected, setSpecimenSelected] = useState<Set<string>>(new Set());
		const [vitalSelected, setVitalSelected] = useState<Set<string>>(new Set());
		const [strategySelected, setStrategySelected] = useState<Set<string>>(new Set());

		return (
			<div style={{ maxWidth: '400px' }}>
				<TermAggs
					displayName="Specimen Type"
					fieldName="specimens__specimen_type"
					buckets={specimenTypeBuckets}
					maxTerms={5}
					isActive={({ value }) => specimenSelected.has(value)}
					handleValueClick={({ value }) => {
						const newSelected = new Set(specimenSelected);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setSpecimenSelected(newSelected);
					}}
				/>

				<TermAggs
					displayName="Vital Status"
					fieldName="donors__vital_status"
					buckets={vitalStatusBuckets}
					maxTerms={5}
					isActive={({ value }) => vitalSelected.has(value)}
					handleValueClick={({ value }) => {
						const newSelected = new Set(vitalSelected);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setVitalSelected(newSelected);
					}}
				/>

				<TermAggs
					displayName="Data Strategy"
					fieldName="files__data_strategy"
					buckets={dataStrategyBuckets}
					maxTerms={5}
					isActive={({ value }) => strategySelected.has(value)}
					handleValueClick={({ value }) => {
						const newSelected = new Set(strategySelected);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setStrategySelected(newSelected);
					}}
				/>
			</div>
		);
	},
};

/**
 * With Data Attributes
 * Shows data attributes for external integration
 */
export const WithDataAttributes: Story = {
	args: {
		displayName: 'File Type',
		fieldName: 'files__file_type',
		type: 'keyword',
		buckets: fileTypeBuckets,
		maxTerms: 5,
	},
};

/**
 * Custom MaxTerms
 * Shows different pagination thresholds
 */
export const CustomMaxTerms: Story = {
	render: () => {
		const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

		return (
			<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
				<div style={{ width: '300px' }}>
					<h4>maxTerms=3</h4>
					<TermAggs
						displayName="Primary Site"
						fieldName="donors__primary_site"
						buckets={primarySiteBuckets}
						maxTerms={3}
						isActive={({ value }) => selectedValues.has(value)}
						handleValueClick={({ value }) => {
							const newSelected = new Set(selectedValues);
							if (newSelected.has(value.name)) {
								newSelected.delete(value.name);
							} else {
								newSelected.add(value.name);
							}
							setSelectedValues(newSelected);
						}}
					/>
				</div>

				<div style={{ width: '300px' }}>
					<h4>maxTerms=10</h4>
					<TermAggs
						displayName="Primary Site"
						fieldName="donors__primary_site"
						buckets={primarySiteBuckets}
						maxTerms={10}
						isActive={({ value }) => selectedValues.has(value)}
						handleValueClick={({ value }) => {
							const newSelected = new Set(selectedValues);
							if (newSelected.has(value.name)) {
								newSelected.delete(value.name);
							} else {
								newSelected.add(value.name);
							}
							setSelectedValues(newSelected);
						}}
					/>
				</div>
			</div>
		);
	},
};

/**
 * With Value Character Limit
 * Shows truncation of long values
 */
export const WithCharacterLimit: Story = {
	render: () => {
		const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

		return (
			<div style={{ maxWidth: '400px' }}>
				<div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5' }}>
					<strong>Note:</strong> Long values are truncated to 20 characters
				</div>
				<TermAggs
					displayName="Diagnosis"
					fieldName="diagnoses__diagnosis"
					buckets={diagnosisBuckets}
					maxTerms={10}
					valueCharacterLimit={20}
					isActive={({ value }) => selectedValues.has(value)}
					handleValueClick={({ value }) => {
						const newSelected = new Set(selectedValues);
						if (newSelected.has(value.name)) {
							newSelected.delete(value.name);
						} else {
							newSelected.add(value.name);
						}
						setSelectedValues(newSelected);
					}}
				/>
			</div>
		);
	},
};
