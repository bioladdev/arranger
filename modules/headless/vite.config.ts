import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/main.ts'),
			formats: ['es'],
			fileName: (format) => `my-library.${format}.js`,
		},
	},
});
