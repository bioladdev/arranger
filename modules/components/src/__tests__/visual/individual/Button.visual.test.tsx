import React from 'react';
import { describe, it } from 'vitest';
import Button, { TransparentButton } from '#Button/index.js';
import { ThemeProvider } from '#ThemeContext/index.js';
import { renderAndSnapshot } from '../utils/test-helpers.js';

// Wrapper with theme provider for consistent theming
const ButtonTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
		<ThemeProvider>{children}</ThemeProvider>
	</div>
);

describe('Button Visual Tests', () => {
	it('renders default button', async () => {
		await renderAndSnapshot(
			<Button>Default Button</Button>,
			'button-default',
			{ wrapper: ButtonTestWrapper }
		);
	});

	it('renders disabled button', async () => {
		await renderAndSnapshot(
			<Button disabled>Disabled Button</Button>,
			'button-disabled',
			{ wrapper: ButtonTestWrapper }
		);
	});

	it('renders button with custom theme', async () => {
		await renderAndSnapshot(
			<Button 
				theme={{ 
					background: '#007bff', 
					fontColor: '#ffffff',
					borderRadius: '8px'
				}}
			>
				Custom Button
			</Button>,
			'button-custom-theme',
			{ wrapper: ButtonTestWrapper }
		);
	});

	it('renders transparent button', async () => {
		await renderAndSnapshot(
			<TransparentButton>Transparent Button</TransparentButton>,
			'button-transparent',
			{ wrapper: ButtonTestWrapper }
		);
	});

	it('renders button variants collection', async () => {
		await renderAndSnapshot(
			<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
				<div style={{ display: 'flex', gap: '10px' }}>
					<Button>Normal</Button>
					<Button disabled>Disabled</Button>
					<Button theme={{ background: '#28a745', fontColor: '#fff' }}>Success</Button>
				</div>
				<div style={{ display: 'flex', gap: '10px' }}>
					<Button theme={{ background: '#dc3545', fontColor: '#fff' }}>Danger</Button>
					<Button theme={{ background: '#ffc107', fontColor: '#000' }}>Warning</Button>
					<TransparentButton>Transparent</TransparentButton>
				</div>
			</div>,
			'button-variants-collection',
			{ wrapper: ButtonTestWrapper }
		);
	});
});