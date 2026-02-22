import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			// Required: Entry file for the library
			entry: resolve(__dirname, 'src/main.js'),
			formats: ['es'],
			fileName: (format) => `my-library.${format}.js`,
		},
	},
});
