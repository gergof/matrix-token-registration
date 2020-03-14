import Matrix from 'matrix-js-sdk';
import { logger as matrixLogger } from 'matrix-js-sdk/lib/logger';
let client;

const init = ({ config, logger }) => {
	return new Promise((resolve, reject) => {
		// rewrite matrix logger
		matrixLogger.info = (...msg) =>
			logger.log({ level: 'info', message: msg.join(' ') });
		matrixLogger.log = (...msg) =>
			logger.log({ level: 'info', message: msg.join(' ') });
		matrixLogger.warn = (...msg) =>
			logger.log({ level: 'warn', message: msg.join(' ') });
		matrixLogger.error = (...msg) =>
			logger.log({ level: 'error', message: msg.join(' ') });
		matrixLogger.trace = (...msg) =>
			logger.log({ level: 'debug', message: msg.join(' ') });

		logger.log({ level: 'info', message: 'Starting matrix client' });
		client = Matrix.createClient({
			baseUrl: config.matrix.homeserver,
			userId: config.bot.user,
			accessToken: config.bot.token
		});
		matrix.client = client;

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
