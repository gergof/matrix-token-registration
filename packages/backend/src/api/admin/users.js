import { validate, Joi } from 'express-validation';
import isAuthorized from '../isAuthorized';

const users = ({ db }) => app => {
	app.get(
		'/api/admin/users',
		isAuthorized(db, (req, res, user) => {
			if (!['admin', 'root'].includes(user.role)) {
				res.status(403);
				res.json({ error: 'Unauthorized' });
				return;
			}

			db.models.User.findAll().then(users => {
				res.json(users);
			});
		})
	);

	app.post(
		'/api/admin/users',
		validate({
			body: Joi.object({
				matrixId: Joi.string().required(),
				role: Joi.string()
					.valid('admin', 'user')
					.required()
			}).required()
		}),
		isAuthorized(db, (req, res, user) => {
			if (!['admin', 'root'].includes(user.role)) {
				res.status(403);
				res.json({ error: 'Unauthorized' });
				return;
			}

			db.models.User.findAll({
				where: {
					matrixId: req.body.matrixId
				}
			}).then(users => {
				if (users.length) {
					res.status(400);
					res.json({ error: 'User already exists' });
					return;
				}

				db.models.User.create({
					matrixId: req.body.matrixId,
					role: req.body.role
				}).then(user => {
					res.status(201);
					res.json(user);
				});
			});
		})
	);

	app.put(
		'/api/admin/users/:id',
		validate({
			body: Joi.object({
				role: Joi.string()
					.valid('admin', 'user')
					.required()
			})
		}),
		isAuthorized(db, (req, res, user) => {
			if (!['admin', 'root'].includes(user.role)) {
				res.status(403);
				res.json({ error: 'Unauthorized' });
				return;
			}

			db.models.User.findAll({
				where: {
					id: req.params.id
				}
			})
				.then(rows => rows[0])
				.then(user => {
					if (!user) {
						res.status(404);
						res.json({ error: 'Not found' });
						return;
					}

					user
						.update({
							role: req.body.role
						})
						.then(user => {
							res.json(user);
						});
				});
		})
	);

	app.delete(
		'/api/admin/users/:id',
		isAuthorized(db, (req, res, user) => {
			if (!['admin', 'root'].includes(user.role)) {
				res.status(403);
				res.json({ error: 'Unauthorized' });
				return;
			}

			db.models.User.findAll({
				where: {
					id: req.params.id
				}
			})
				.then(rows => rows[0])
				.then(user => {
					if (!user) {
						res.status(404);
						res.json({ error: 'Not found' });
						return;
					}

					return user.destroy();
				})
				.then(() => {
					res.json({ msg: 'Deleted' });
				});
		})
	);
};

export default users;
