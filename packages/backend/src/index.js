import config from './config';
import { getLogger } from './logging';

import { db } from './database';
import { express } from './express';
import sessionStorage from './sessions';
import { matrix } from './matrix';

const logger = getLogger('main');

// initialization sequence
logger.log({ level: 'info', message: 'Starting up' });
db.init({ logger: getLogger('db') })
	.then(() => {
		logger.log({ level: 'info', message: 'Database ready' });
	})
	.then(() => sessionStorage.init({ logger: getLogger('session') }))
	.then(() => {
		logger.log({ level: 'info', message: 'Session storage ready' });
	})
	.then(() =>
		express.init({ config, logger: getLogger('express'), db: db.sequelize })
	)
	.then(() => {
		logger.log({ level: 'info', message: 'Express ready' });
	})
	.then(() => matrix.init({ config, logger: getLogger('matrix') }))
	.then(() => {
		logger.log({ level: 'info', message: 'Matrix ready' });
	})
	.then(() => {
		logger.log({ level: 'info', message: 'Initialization sequence completed' });
	})
	.catch(e => {
		logger.log({
			level: 'error',
			message: 'Error during initialization: ' + e
		});
		process.exit(1);
	});

// shutdown sequence
const close = () => {
	process.removeAllListeners();

	logger.log({ level: 'info', message: 'Shutting down' });

	db.close()
		.then(() => {
			logger.log({ level: 'info', message: 'Database shut down' });
		})
		.then(() => sessionStorage.close())
		.then(() => {
			logger.log({ level: 'info', message: 'Session storage shut down' });
		})
		.then(() => express.close())
		.then(() => {
			logger.log({ level: 'info', message: 'Express shut down' });
		})
		.then(() => matrix.close())
		.then(() => {
			logger.log({ level: 'info', message: 'Matrix shut down' });
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
