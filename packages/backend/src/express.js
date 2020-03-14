import Express from 'express';
import http from 'http';
import BodyParser from 'body-parser';
import path from 'path';

const app = new Express();
const server = http.createServer(app);

app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(Express.static(path.join(__dirname, 'public')));

const init = ({ config, logger }) => {
	return new Promise((resolve, reject) => {
		logger.log({ level: 'info', message: 'Initializing express' });
		server.on('error', e => {
			logger.log({ level: 'error', message: 'Error: ' + e });
			if (e.code === 'EADDRINUSE') {
				reject();
			}
		});
		server.listen(config.server.port, () => {
			resolve();
		});
	});
};

const close = () => {
	return new Promise(resolve => {
		server.close(resolve);
	});
};

const express = { init, close };

export { express };
export default app;
