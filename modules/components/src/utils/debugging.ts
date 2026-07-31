import { DEBUG } from '#utils/config';

export const debugLogs = (...args: unknown[]) => {
	DEBUG && console.log('debugLogs', ...args);
};
