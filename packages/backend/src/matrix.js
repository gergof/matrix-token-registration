let client;

const init = ({ config, logger }) => {
	return new Promise((resolve, reject) => {
		// trick to set custom logger

		/* eslint-disable no-console */
		const oldLog = console.log;
		const oldWarn = console.warn;
		const oldError = console.error;
		const oldDebug = console.debug;
		global.console.log = (...msg) =>
			logger.log({ level: 'info', message: msg.join(' ') });
		global.console.warn = (...msg) =>
			logger.log({ level: 'warning', message: msg.join(' ') });
		global.console.error = (...msg) =>
			logger.log({ level: 'error', message: msg.join(' ') });
		global.console.debug = (...msg) =>
			logger.log({ level: 'debug', message: msg.join(' ') });
		/* eslint-enable */

		const Matrix = require('matrix-js-sdk');

		logger.log({ level: 'info', message: 'Starting matrix client' });
		client = Matrix.createClient({
			baseUrl: config.matrix.homeserver,
			userId: config.bot.user,
			accessToken: config.bot.token
		});
		matrix.client = client;

		/* eslint-disable no-console */
		global.console.log = oldLog;
		global.console.warn = oldWarn;
		global.console.error = oldError;
		global.console.debug = oldDebug;
		/* eslint-enable */

		client.startClient({ initialSyncLimit: 10 }).then(() => {
			logger.log({ level: 'info', message: 'Client started' });
			logger.log({ level: 'info', message: 'Starting sync' });
			client.once('sync', state => {
				if (state == 'PREPARED') {
					resolve();
				} else {
					logger.log({
						level: 'error',
						message: 'Error during sync. Current state: ' + state
					});
					reject('sync error. Current state: ' + state);
				}
			});
		});
	});
};

const close = () => {
	return new Promise(resolve => {
		client.stopClient();
		resolve();
	});
};

const matrix = { init, close, client };

export { matrix };
export default client;
