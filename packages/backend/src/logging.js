import Winston from 'winston';

const logger = Winston.createLogger({
	level: process.env.NODE_ENV == 'production' ? 'info' : 'debug',
	format: Winston.format.combine(
		Winston.format.timestamp(),
		Winston.format.colorize({
			colors: { info: 'blue', error: 'red' }
		}),
		Winston.format.padLevels(),
		Winston.format.printf(
			info =>
				`[${info.timestamp}] [${info.level}] [${info.group}] ${info.message}`
		)
	),
	transports:
		process.env.NODE_ENV == 'production'
			? [
					new Winston.transports.File({
						filename: '/data/matrix-token-registration.log',
						maxSize: 10485760,
						maxFiles: 10,
						tailable: true
					}),
					new Winston.transports.Console()
			  ]
			: [new Winston.transports.Console()]
});

const getLogger = group => {
	return logger.child({ group });
};

export { getLogger };
export default logger;
