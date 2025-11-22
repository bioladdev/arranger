import type { Meta, StoryObj } from '@storybook/react';
import Button, { TransparentButton } from './index';

/**
 * Button component - Refactored to use CSS Modules
 *
 * This story demonstrates the Button component after migration from @emotion to CSS Modules.
 * All variants and states should look identical to the previous implementation.
 */
const meta = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		children: {
			control: 'text',
			description: 'Button content',
		},
		disabled: {
			control: 'boolean',
			description: 'Disabled state',
		},
		hidden: {
			control: 'boolean',
			description: 'Hidden state',
		},
		onClick: {
			action: 'clicked',
			description: 'Click handler',
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Button
 * Standard button with default styling from CSS variables
 */
export const Default: Story = {
	args: {
		children: 'Default Button',
	},
};

/**
 * Button with Click Handler
 * Shows cursor: pointer when clickable
 */
export const Clickable: Story = {
	args: {
		children: 'Click Me',
		onClick: () => alert('Button clicked!'),
	},
};

/**
 * Disabled Button
 * Uses disabled state styles from CSS module
 */
export const Disabled: Story = {
	args: {
		children: 'Disabled Button',
		disabled: true,
	},
};

/**
 * Hidden Button
 * Sets visibility: hidden and pointer-events: none
 */
export const Hidden: Story = {
	args: {
		children: 'Hidden Button',
		hidden: true,
	},
};

/**
 * Button with Custom Theme Props
 * Theme props are applied via inline styles for dynamic customization
 */
export const WithCustomTheme: Story = {
	args: {
		children: 'Custom Themed Button',
		theme: {
			fontFamily: 'monospace',
			fontSize: '1rem',
			padding: '1rem 2rem',
		},
	},
};

/**
 * Multiple Buttons
 * Shows how buttons look side-by-side
 */
export const MultipleButtons: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
			<div style={{ display: 'flex', gap: '0.5rem' }}>
				<Button>First</Button>
				<Button>Second</Button>
				<Button>Third</Button>
			</div>
			<div style={{ display: 'flex', gap: '0.5rem' }}>
				<Button disabled>Disabled</Button>
				<Button onClick={() => {}}>Clickable</Button>
			</div>
		</div>
	),
};

/**
 * Transparent Button Stories
 */
const transparentMeta = {
	title: 'Components/Button/TransparentButton',
	component: TransparentButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof TransparentButton>;

type TransparentStory = StoryObj<typeof transparentMeta>;

/**
 * Default Transparent Button
 * No background, no border, inherits color
 */
export const TransparentDefault: TransparentStory = {
	args: {
		children: 'Transparent Button',
	},
};

/**
 * Transparent Button with Border
 * Shows variant with custom border
 */
export const TransparentWithBorder: TransparentStory = {
	args: {
		children: 'Transparent with Border',
		theme: {
			borderColor: '#cacbcf',
		},
	},
};

/**
 * Transparent Button with Custom Color
 * Demonstrates dynamic hover color calculation
 */
export const TransparentWithColor: TransparentStory = {
	args: {
		children: 'Colored Transparent Button',
		theme: {
			fontColor: '#2196f3',
		},
	},
};

/**
 * Transparent Button Disabled
 */
export const TransparentDisabled: TransparentStory = {
	args: {
		children: 'Disabled Transparent',
		disabled: true,
	},
};

/**
 * Comparison: Standard vs Transparent
 * Shows both button types side-by-side
 */
export const Comparison: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'flex-start' }}>
			<div>
				<strong>Standard Button:</strong>
				<div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
					<Button>Default</Button>
					<Button onClick={() => {}}>Clickable</Button>
					<Button disabled>Disabled</Button>
				</div>
			</div>
			<div>
				<strong>Transparent Button:</strong>
				<div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
					<TransparentButton>Default</TransparentButton>
					<TransparentButton onClick={() => {}}>Clickable</TransparentButton>
					<TransparentButton disabled>Disabled</TransparentButton>
				</div>
			</div>
		</div>
	),
};
