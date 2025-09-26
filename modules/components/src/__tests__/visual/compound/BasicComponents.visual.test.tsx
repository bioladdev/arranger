import React from 'react';
import { describe, it } from 'vitest';
import Button from '#Button/index.js';
import Input from '#Input/Input.js';
import { CheckIcon, ResetIcon } from '#Icons/index.js';
import { ThemeProvider } from '#ThemeContext/index.js';
import { renderAndSnapshot } from '../utils/test-helpers.js';

const CompoundTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ padding: '20px', maxWidth: '600px' }}>
		<ThemeProvider>{children}</ThemeProvider>
	</div>
);

describe('Basic Components Compound Visual Tests', () => {
	it('renders search form with input and buttons', async () => {
		await renderAndSnapshot(
			<div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
				<h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Search Form</h3>
				<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
					<Input 
						theme={{ 
							placeholder: 'Search for items...',
							showClear: true 
						}} 
					/>
					<Button theme={{ background: '#007bff', fontColor: '#fff' }}>
						Search
					</Button>
				</div>
			</div>,
			'compound-search-form',
			{ wrapper: CompoundTestWrapper }
		);
	});

	it('renders action panel with icons and buttons', async () => {
		await renderAndSnapshot(
			<div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
				<h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Action Panel</h3>
				<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
					<Button theme={{ background: '#28a745', fontColor: '#fff' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
							<CheckIcon />
							Confirm
						</div>
					</Button>
					<Button theme={{ background: '#dc3545', fontColor: '#fff' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
							<ResetIcon />
							Reset
						</div>
					</Button>
					<Button disabled>
						Disabled Action
					</Button>
				</div>
			</div>,
			'compound-action-panel',
			{ wrapper: CompoundTestWrapper }
		);
	});

	it('renders form with multiple inputs and validation states', async () => {
		await renderAndSnapshot(
			<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
				<h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>User Form</h3>
				
				<div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
					<label style={{ fontSize: '14px', fontWeight: 'bold' }}>Name</label>
					<Input theme={{ placeholder: 'Enter your name' }} />
				</div>
				
				<div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
					<label style={{ fontSize: '14px', fontWeight: 'bold' }}>Email</label>
					<Input theme={{ placeholder: 'Enter your email', showClear: true }} />
				</div>
				
				<div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
					<label style={{ fontSize: '14px', fontWeight: 'bold', color: '#6c757d' }}>
						Optional Field (Disabled)
					</label>
					<Input disabled theme={{ placeholder: 'This field is disabled' }} />
				</div>
				
				<div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
					<Button>Cancel</Button>
					<Button theme={{ background: '#007bff', fontColor: '#fff' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
							<CheckIcon />
							Submit
						</div>
					</Button>
				</div>
			</div>,
			'compound-user-form',
			{ wrapper: CompoundTestWrapper }
		);
	});

	it('renders component showcase grid', async () => {
		await renderAndSnapshot(
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
				<div>
					<h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Buttons</h4>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
						<Button>Default</Button>
						<Button theme={{ background: '#28a745', fontColor: '#fff' }}>Success</Button>
						<Button disabled>Disabled</Button>
					</div>
				</div>
				
				<div>
					<h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Inputs</h4>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
						<Input theme={{ placeholder: 'Regular input' }} />
						<Input theme={{ placeholder: 'With clear', showClear: true }} />
						<Input disabled theme={{ placeholder: 'Disabled' }} />
					</div>
				</div>
				
				<div>
					<h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Icons</h4>
					<div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
						<CheckIcon />
						<ResetIcon />
					</div>
				</div>
				
				<div>
					<h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Combined</h4>
					<div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
						<Input theme={{ placeholder: 'Quick search' }} />
						<Button theme={{ background: '#007bff', fontColor: '#fff', padding: '8px' }}>
							<CheckIcon />
						</Button>
					</div>
				</div>
			</div>,
			'compound-showcase-grid',
			{ wrapper: CompoundTestWrapper }
		);
	});
});