import { Sequelize } from 'sequelize';
import models from './models';
import associations from './models/associations';

let sequelize;

const init = ({ logger }) => {
	logger.log({ level: 'info', message: 'Initializing database' });
	sequelize = new Sequelize(
		process.env.NODE_ENV == 'production'
			? 'sqlite:/data/database.sqlite'
			: 'sqlite:database.sqlite',
		{
			logging: msg => logger.log({ level: 'debug', message: msg })
		}
	);
	db.sequelize = sequelize;

	logger.log({ level: 'info', message: 'Loading models' });
	models.map(model => {
		model(sequelize);
	});
	associations(sequelize.models);
	logger.log({ level: 'info', message: 'Models loaded' });

	return sequelize
		.authenticate()
		.then(() => {
			logger.log({ level: 'info', message: 'Database initialized' });
		})
		.catch(e => {
			logger.log({
				level: 'error',
				message: 'Database initialization failed: ' + e
			});
			process.exit(1);
		});
};

const close = () => {
	return sequelize.close();
};

const db = { init, close, sequelize };

export { db };
export default sequelize;
