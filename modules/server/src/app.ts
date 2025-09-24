import cors from 'cors';
import express, { json, urlencoded, type Router } from 'express';

import { ENV_CONFIG } from './config/index.js';
import arranger from './server.js';

const app = express();
app.use(cors());

export default async function App(rootPath = ''): Promise<void> {
	(global as any).__basedir = rootPath;

	return arranger({
		enableAdmin: ENV_CONFIG.ENABLE_ADMIN,
	}).then((router: Router) => {
		app.use(urlencoded({ extended: false, limit: '50mb' }));
		app.use(json({ limit: '50mb' }));
		app.use(router);

		app.listen(ENV_CONFIG.PORT, async () => {
			const message = `⚡️⚡️⚡️ Listening on port ${ENV_CONFIG.PORT} ⚡️⚡️⚡️`;
			const line = '-'.repeat(message.length);

			console.info(`\n${line}`);
			console.log(message);
			console.info(`${line}\n`);
			ENV_CONFIG.DEBUG_MODE && console.log(`URL: http://localhost:${ENV_CONFIG.PORT}\n`);
		});
	});
}
