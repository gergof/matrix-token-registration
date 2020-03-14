import config from './config';
import { getLogger } from './logging';

import { db } from './database';
import { express } from './express';

const logger = getLogger('main');

// initialization sequence
logger.log({ level: 'info', message: 'Starting up' });
db.init({ logger: getLogger('db') })
	.then(() => {
		logger.log({ level: 'info', message: 'Database ready' });
	})
	.then(() => express.init({ config, logger: getLogger('express') }))
	.then(() => {
		logger.log({ level: 'info', message: 'Express ready' });
	})
	.then(() => {
		logger.log({ level: 'info', message: 'Initialization sequence completed' });
	})
	.catch(e => {
		logger.log({
			level: 'error',
			message: 'Error during initialization: ' + e
		});
	});

// shutdown sequence
const close = () => {
	process.removeAllListeners();

	logger.log({ level: 'info', message: 'Shutting down' });

	db.close()
		.then(() => {
			logger.log({ level: 'info', message: 'Database shut down' });
		})
		.then(() => express.close())
		.then(() => {
			logger.log({ level: 'info', message: 'Express shut down' });
		})
		.then(() => {
			logger.log({ level: 'info', message: 'Shutdown sequence completed' });
			process.exit();
		})
		.catch(e => {
			logger.log({ level: 'error', message: 'Error during shutdown: ' + e });
		});
};

// handle close events
process.on('exit', close);
process.on('SIGINT', close);
process.on('SIGTERM', close);
process.on('SIGUSR1', close);
process.on('SIGUSR2', close);
