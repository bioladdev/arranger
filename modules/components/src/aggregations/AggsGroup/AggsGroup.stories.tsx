import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import AggsGroup from './index';
import TextFilter from '#TextFilter/index.js';

/**
 * AggsGroup component - Container for aggregation filters
 *
 * AggsGroup provides a collapsible container for aggregation filters with:
 * - Collapsible/expandable sections
 * - Search filtering capability
 * - Sort toggle functionality
 * - Sticky header support
 * - Filter content display
 */
const meta = {
	title: 'Components/Aggregations/AggsGroup',
	component: AggsGroup,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		displayName: {
			control: 'text',
			description: 'Display name for the aggregation group',
		},
		collapsible: {
			control: 'boolean',
			description: 'Enable collapse/expand functionality',
		},
		filterable: {
			control: 'boolean',
			description: 'Show filter button',
		},
		sortable: {
			control: 'boolean',
			description: 'Show sort button',
		},
		stickyHeader: {
			control: 'boolean',
			description: 'Make header sticky on scroll',
		},
	},
} satisfies Meta<typeof AggsGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default AggsGroup
 * Basic aggregation group with sample content
 */
export const Default: Story = {
	args: {
		displayName: 'Specimen Type',
		children: (
			<div style={{ padding: '0.5rem' }}>
				<div>Primary Tumor (1,245)</div>
				<div>Metastatic (432)</div>
				<div>Normal (876)</div>
			</div>
		),
	},
};

/**
 * Collapsible Group
 * Interactive example showing collapse/expand functionality
 */
export const Collapsible: Story = {
	render: () => {
		return (
			<AggsGroup
				displayName="File Type"
				collapsible={true}
			>
				<div style={{ padding: '0.5rem' }}>
					<div>BAM (3,456)</div>
					<div>VCF (2,890)</div>
					<div>FASTQ (4,521)</div>
					<div>TSV (1,234)</div>
				</div>
			</AggsGroup>
		);
	},
};

/**
 * Non-Collapsible Group
 * Group that cannot be collapsed
 */
export const NonCollapsible: Story = {
	args: {
		displayName: 'Vital Status',
		collapsible: false,
		children: (
			<div style={{ padding: '0.5rem' }}>
				<div>Alive (8,765)</div>
				<div>Deceased (2,345)</div>
				<div>Unknown (456)</div>
			</div>
		),
	},
};

/**
 * With Filter Active
 * Shows filter icon active state with search box displayed
 */
export const WithFilterActive: Story = {
	render: () => {
		const [searchText, setSearchText] = useState('');
		const [isFiltered, setIsFiltered] = useState(true);

		return (
			<AggsGroup
				displayName="Gene Symbol"
				filterable={true}
				isFiltered={isFiltered}
				onFilterClick={() => setIsFiltered(!isFiltered)}
				filters={
					isFiltered
						? [
								<TextFilter
									key="filter"
									onChange={({ value }) => setSearchText(value || '')}
									theme={{
										placeholder: 'Search genes...',
									}}
									value={searchText}
								/>,
						  ]
						: []
				}
			>
				<div style={{ padding: '0.5rem' }}>
					<div>TP53 (5,432)</div>
					<div>BRCA1 (3,210)</div>
					<div>BRCA2 (2,987)</div>
					<div>EGFR (2,765)</div>
				</div>
			</AggsGroup>
		);
	},
};

/**
 * With Sort Active
 * Shows sort icon in active state
 */
export const WithSortActive: Story = {
	render: () => {
		const [isSorted, setIsSorted] = useState(false);

		return (
			<AggsGroup
				displayName="Primary Site"
				sortable={true}
				isSorted={isSorted}
				onSortClick={() => setIsSorted(!isSorted)}
			>
				<div style={{ padding: '0.5rem' }}>
					{isSorted ? (
						<>
							<div>Brain (1,234)</div>
							<div>Breast (3,123)</div>
							<div>Colorectal (1,987)</div>
							<div>Lung (3,456)</div>
							<div>Prostate (2,345)</div>
							<div>Skin (1,098)</div>
						</>
					) : (
						<>
							<div>Lung (3,456)</div>
							<div>Breast (3,123)</div>
							<div>Prostate (2,345)</div>
							<div>Colorectal (1,987)</div>
							<div>Brain (1,234)</div>
							<div>Skin (1,098)</div>
						</>
					)}
				</div>
			</AggsGroup>
		);
	},
};

/**
 * Fully Interactive
 * Complete example with all features enabled and interactive
 */
export const FullyInteractive: Story = {
	render: () => {
		const [searchText, setSearchText] = useState('');
		const [isFiltered, setIsFiltered] = useState(false);
		const [isSorted, setIsSorted] = useState(false);

		const items = [
			{ name: 'Adenocarcinoma', count: 2345 },
			{ name: 'Squamous Cell Carcinoma', count: 1876 },
			{ name: 'Ductal Carcinoma', count: 1543 },
			{ name: 'Glioblastoma', count: 987 },
			{ name: 'Melanoma', count: 876 },
			{ name: 'Leukemia', count: 765 },
			{ name: 'Lymphoma', count: 654 },
		];

		const filteredItems = searchText
			? items.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
			: items;

		const displayItems = isSorted
			? [...filteredItems].sort((a, b) => a.name.localeCompare(b.name))
			: filteredItems;

		return (
			<AggsGroup
				displayName="Diagnosis"
				collapsible={true}
				filterable={true}
				sortable={true}
				isFiltered={isFiltered}
				isSorted={isSorted}
				onFilterClick={() => setIsFiltered(!isFiltered)}
				onSortClick={() => setIsSorted(!isSorted)}
				filters={
					isFiltered
						? [
								<TextFilter
									key="filter"
									onChange={({ value }) => setSearchText(value || '')}
									theme={{
										placeholder: 'Search diagnosis...',
									}}
									value={searchText}
								/>,
						  ]
						: []
				}
			>
				<div style={{ padding: '0.5rem' }}>
					{displayItems.map((item) => (
						<div key={item.name}>
							{item.name} ({item.count.toLocaleString()})
						</div>
					))}
					{displayItems.length === 0 && <div>No results found</div>}
				</div>
			</AggsGroup>
		);
	},
};

/**
 * Multiple Groups
 * Shows multiple aggregation groups stacked
 */
export const MultipleGroups: Story = {
	render: () => {
		return (
			<div style={{ maxWidth: '400px' }}>
				<AggsGroup
					displayName="Specimen Type"
					collapsible={true}
				>
					<div style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
						<div>Primary Tumor (1,245)</div>
						<div>Metastatic (432)</div>
						<div>Normal (876)</div>
					</div>
				</AggsGroup>

				<AggsGroup
					displayName="Vital Status"
					collapsible={true}
				>
					<div style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
						<div>Alive (8,765)</div>
						<div>Deceased (2,345)</div>
					</div>
				</AggsGroup>

				<AggsGroup
					displayName="Data Strategy"
					collapsible={true}
				>
					<div style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
						<div>WGS (4,567)</div>
						<div>WXS (3,456)</div>
						<div>RNA-Seq (2,987)</div>
					</div>
				</AggsGroup>
			</div>
		);
	},
};

/**
 * Sticky Header
 * Demonstrates sticky header behavior with scrollable content
 */
export const StickyHeader: Story = {
	render: () => {
		return (
			<div style={{ height: '400px', overflow: 'auto', border: '1px solid #ccc' }}>
				<div style={{ height: '200px', padding: '1rem', background: '#f5f5f5' }}>
					Scroll down to see sticky header behavior
				</div>

				<AggsGroup
					displayName="Gene Symbol"
					collapsible={true}
					stickyHeader={true}
				>
					<div style={{ padding: '0.5rem' }}>
						{[
							'TP53',
							'BRCA1',
							'BRCA2',
							'EGFR',
							'KRAS',
							'PIK3CA',
							'PTEN',
							'APC',
							'BRAF',
							'NRAS',
							'MYC',
							'RB1',
						].map((gene, i) => (
							<div key={gene} style={{ padding: '0.3rem 0' }}>
								{gene} ({(5000 - i * 300).toLocaleString()})
							</div>
						))}
					</div>
				</AggsGroup>

				<div style={{ height: '200px', padding: '1rem', background: '#f5f5f5' }}>
					Additional content below
				</div>
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
		dataFields: {
			'data-fieldname': 'files.file_type',
			'data-type': 'keyword',
		},
		children: (
			<div style={{ padding: '0.5rem' }}>
				<div>BAM (3,456)</div>
				<div>VCF (2,890)</div>
			</div>
		),
	},
};

/**
 * Disabled Features
 * Shows behavior when filter/sort is disabled while collapsed
 */
export const DisabledFeatures: Story = {
	render: () => {
		return (
			<div style={{ maxWidth: '400px' }}>
				<div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5' }}>
					<strong>Note:</strong> When collapsed, filter and sort buttons are disabled
				</div>
				<AggsGroup
					displayName="Primary Site"
					collapsible={true}
					filterable={true}
					sortable={true}
				>
					<div style={{ padding: '0.5rem' }}>
						<div>Lung (3,456)</div>
						<div>Breast (3,123)</div>
						<div>Prostate (2,345)</div>
					</div>
				</AggsGroup>
			</div>
		);
	},
};
