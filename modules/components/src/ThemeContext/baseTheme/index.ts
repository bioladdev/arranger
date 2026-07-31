import createPalette, { colors } from './palette/index';
import shape from './shape';

export default {
	colors,
	palette: createPalette(),
	shape,
};

export * as paletteItems from './palette/index';
