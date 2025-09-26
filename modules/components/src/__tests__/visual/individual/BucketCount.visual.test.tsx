import React from 'react';
import { describe, it } from 'vitest';
import BucketCount from '#aggregations/BucketCount/index.js';
import { ThemeProvider } from '#ThemeContext/index.js';
import { renderAndSnapshot } from '../utils/test-helpers.js';

const BucketCountTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ padding: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
		<ThemeProvider>{children}</ThemeProvider>
	</div>
);

describe('BucketCount Visual Tests', () => {
	it('renders default bucket count', async () => {
		await renderAndSnapshot(
			<BucketCount>42</BucketCount>,
			'bucket-count-default',
			{ wrapper: BucketCountTestWrapper }
		);
	});

	it('renders active bucket count', async () => {
		await renderAndSnapshot(
			<BucketCount className="active">156</BucketCount>,
			'bucket-count-active',
			{ wrapper: BucketCountTestWrapper }
		);
	});

	it('renders disabled bucket count', async () => {
		await renderAndSnapshot(
			<BucketCount className="disabled">0</BucketCount>,
			'bucket-count-disabled',
			{ wrapper: BucketCountTestWrapper }
		);
	});

	it('renders bucket count with custom theme', async () => {
		await renderAndSnapshot(
			<BucketCount 
				theme={{ 
					background: '#e3f2fd',
					borderColor: '#2196f3',
					fontColor: '#1976d2'
				}}
			>
				89
			</BucketCount>,
			'bucket-count-custom-theme',
			{ wrapper: BucketCountTestWrapper }
		);
	});

	it('renders bucket count states collection', async () => {
		await renderAndSnapshot(
			<div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
					<BucketCount>42</BucketCount>
					<span style={{ fontSize: '12px' }}>Default</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
					<BucketCount className="active">156</BucketCount>
					<span style={{ fontSize: '12px' }}>Active</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
					<BucketCount className="disabled">0</BucketCount>
					<span style={{ fontSize: '12px' }}>Disabled</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
					<BucketCount 
						theme={{ 
							background: '#e8f5e8',
							borderColor: '#4caf50',
							fontColor: '#2e7d32'
						}}
					>
						234
					</BucketCount>
					<span style={{ fontSize: '12px' }}>Custom</span>
				</div>
			</div>,
			'bucket-count-states-collection',
			{ wrapper: BucketCountTestWrapper }
		);
	});
});