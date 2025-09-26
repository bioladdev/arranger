import '@testing-library/jest-dom';
import { beforeAll } from 'vitest';

// Global setup for visual regression tests
beforeAll(async () => {
	// Ensure consistent font rendering
	document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
	document.body.style.fontSize = '14px';
	document.body.style.lineHeight = '1.4';
	
	// Reset any default margins/padding
	document.body.style.margin = '0';
	document.body.style.padding = '20px';
	
	// Set consistent background
	document.body.style.backgroundColor = '#ffffff';
	document.body.style.color = '#000000';
});