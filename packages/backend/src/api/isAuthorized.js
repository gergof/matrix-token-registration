import config from '../config';
import isAuthenticated from './isAuthenticated';

const isAuthorized = (db, handler) =>
	isAuthenticated((req, res, session) => {
		if (session.matrixId == config.server.rootAccount) {
			return handler(req, res, { matrixId: session.matrixId, role: 'root' });
		}

		db.models.User.findAll({
			where: {
				matrixId: session.matrixId
			}
		})
			.then(rows => rows[0])
			.then(user => {
				if (!user) {
					res.status(403);
					res.json({ error: 'Unauthorized' });
					return;
				}

				return handler(req, res, user, session);
			});
	});

export default isAuthorized;
