import React from 'react';
import { describe, it } from 'vitest';
import Input from '#Input/Input.js';
import { ThemeProvider } from '#ThemeContext/index.js';
import { renderAndSnapshot } from '../utils/test-helpers.js';

const InputTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ padding: '20px', width: '300px' }}>
		<ThemeProvider>{children}</ThemeProvider>
	</div>
);

describe('Input Visual Tests', () => {
	it('renders default input', async () => {
		await renderAndSnapshot(
			<Input />,
			'input-default',
			{ wrapper: InputTestWrapper }
		);
	});

	it('renders input with placeholder', async () => {
		await renderAndSnapshot(
			<Input theme={{ placeholder: 'Enter your text here...' }} />,
			'input-with-placeholder',
			{ wrapper: InputTestWrapper }
		);
	});

	it('renders disabled input', async () => {
		await renderAndSnapshot(
			<Input disabled theme={{ placeholder: 'Disabled input' }} />,
			'input-disabled',
			{ wrapper: InputTestWrapper }
		);
	});

	it('renders input with clear button', async () => {
		await renderAndSnapshot(
			<Input 
				theme={{ 
					placeholder: 'Input with clear button',
					showClear: true 
				}} 
			/>,
			'input-with-clear',
			{ wrapper: InputTestWrapper }
		);
	});

	it('renders input variants collection', async () => {
		await renderAndSnapshot(
			<div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
				<Input theme={{ placeholder: 'Default input' }} />
				<Input disabled theme={{ placeholder: 'Disabled input' }} />
				<Input theme={{ placeholder: 'Input with clear', showClear: true }} />
				<Input 
					theme={{ 
						placeholder: 'Custom styled input',
						borderColor: '#007bff',
						padding: '12px'
					}} 
				/>
			</div>,
			'input-variants-collection',
			{ wrapper: InputTestWrapper }
		);
	});
});