import React from 'react';
import { describe, it } from 'vitest';
import { ArrowIcon, CheckIcon, ResetIcon } from '#Icons/index.js';
import { renderAndSnapshot } from '../utils/test-helpers.js';

const IconTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ 
		padding: '20px', 
		display: 'flex', 
		alignItems: 'center', 
		gap: '20px',
		fontSize: '16px'
	}}>
		{children}
	</div>
);

describe('Icons Visual Tests', () => {
	it('renders CheckIcon', async () => {
		await renderAndSnapshot(
			<CheckIcon />,
			'icon-check',
			{ wrapper: IconTestWrapper }
		);
	});

	it('renders ResetIcon', async () => {
		await renderAndSnapshot(
			<ResetIcon />,
			'icon-reset',
			{ wrapper: IconTestWrapper }
		);
	});

	it('renders ArrowIcon', async () => {
		await renderAndSnapshot(
			<ArrowIcon />,
			'icon-arrow',
			{ wrapper: IconTestWrapper }
		);
	});

	it('renders icons with different colors', async () => {
		await renderAndSnapshot(
			<div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
				<div style={{ color: '#000000' }}>
					<CheckIcon />
				</div>
				<div style={{ color: '#007bff' }}>
					<CheckIcon />
				</div>
				<div style={{ color: '#28a745' }}>
					<CheckIcon />
				</div>
				<div style={{ color: '#dc3545' }}>
					<ResetIcon />
				</div>
			</div>,
			'icons-colored',
			{ wrapper: IconTestWrapper }
		);
	});

	it('renders icons collection', async () => {
		await renderAndSnapshot(
			<div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
					<CheckIcon />
					<span style={{ fontSize: '12px' }}>Check</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
					<ResetIcon />
					<span style={{ fontSize: '12px' }}>Reset</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
					<ArrowIcon />
					<span style={{ fontSize: '12px' }}>Arrow</span>
				</div>
			</div>,
			'icons-collection',
			{ wrapper: IconTestWrapper }
		);
	});
});