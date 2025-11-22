import type { Preview } from '@storybook/react';

// Import global CSS variables for CSS Modules
import '../src/styles/theme.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
