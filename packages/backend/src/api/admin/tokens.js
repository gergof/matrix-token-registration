import { validate, Joi } from 'express-validation';
import RandToken from 'rand-token';
import isAuthorized from '../isAuthorized';
import sessions from '../../sessions';

import targetJoinerWorker from './workers/targetJoiner';

const tokens = ({ db }) => app => {
	app.get(
		'/api/admin/tokens',
		isAuthorized(db, (req, res, user) => {
			if (['admin', 'root'].includes(user.role)) {
				db.models.Token.findAll({
					include: [
						{ model: db.models.TokenTarget },
						{ model: db.models.TokenUsage }
					]
				}).then(tokens => {
					res.json(tokens);
				});
			} else {
				user
					.getTokens({
						include: [
							{ model: db.models.TokenTarget },
							{ model: db.models.TokenUsage }
						]
					})
					.then(tokens => {
						res.json(tokens);
					});
			}
		})
	);

	app.post(
		'/api/admin/tokens',
		validate({
			body: Joi.object({
				type: Joi.string()
					.valid('single', 'multi')
					.required(),
				expiry: Joi.date().greater('now'),
				targets: Joi.array()
					.items(
						Joi.object({
							type: Joi.string()
								.valid('room')
								.required(),
							target: Joi.string().required()
						})
					)
					.required()
			}).required()
		}),
		isAuthorized(db, (req, res, user, session) => {
			if (user.role == 'root') {
				res.status(400);
				res.json({ error: 'Root user can only manage users' });
				return;
			}

			if (session.createToken) {
				res.status(400);
				res.json({ error: 'Token creation already in progress' });
				return;
			}

			session = sessions.update(session.sessionId, {
				createToken: {
					...req.body,
					joinStatus: {
						status: 'in progress',
						queue: req.body.targets,
						joined: []
					}
				}
			});

			res.json({ msg: 'In progress' });

			// start worker
			targetJoinerWorker(session);
		})
	);

	app.get(
		'/api/admin/tokens/create/status',
		isAuthorized(db, (req, res, user, session) => {
			if (!session.createToken) {
				res.status(400);
				res.json({ error: 'No token creation in progress' });
				return;
			}

			if (session.createToken.joinStatus.queue.length) {
				// we have queued/failed joins
				res.json(session.createToken.joinStatus);
			} else {
				// we are done
				const tokenStr = RandToken.generator({ chars: 'alpha' }).generate(8);

				// commit changes
				const token = db.models.Token.build({
					token: tokenStr,
					type: session.createToken.type,
					expiry: session.createToken.expiry
				});
				token.setUser(user, { save: false });
				token
					.save()
					.then(() => {
						return Promise.all(
							session.createToken.joinStatus.joined.map(target => {
								const tokenTarget = db.models.TokenTarget.build({
									targetType: target.type,
									target: target.target
								});
								tokenTarget.setToken(token, { save: false });
								return tokenTarget.save();
							})
						);
					})
					.then(() => {
						res.status(201);
						res.json({ ...token.get({ plain: true }), status: 'done' });

						// clear progress from session
						sessions.update(session.sessionId, { createToken: null });
					});
			}
		})
	);

	app.post(
		'/api/admin/tokens/create/retry',
		isAuthorized(db, (req, res, user, session) => {
			if (!session.createToken) {
				res.status(400);
				res.json({ error: 'No token creation in progress' });
				return;
			}

			// rerun worker
			targetJoinerWorker(session);
			res.json({ msg: 'In progress' });
		})
	);

	app.post(
		'/api/admin/tokens/create/cancel',
		isAuthorized(db, (req, res, user, session) => {
			if (!session.createToken) {
				res.status(400);
				res.json({ error: 'No token creation in progress' });
				return;
			}

			sessions.update(session.sessionId, { createToken: null });

			res.json({ msg: 'Cancelled' });
		})
	);

	app.delete(
		'/api/admin/tokens/:id',
		isAuthorized(db, (req, res, user) => {
			if (['admin', 'root'].includes(user.role)) {
				db.models.Token.findOne({ where: { id: req.params.id } }).then(
					token => {
						if (!token) {
							res.status(404);
							res.json({ err: 'Not found' });
							return;
						}

						token.destroy();
						res.json({ msg: 'Deleted' });
					}
				);
			} else {
				db.models.Token.findOne({
					where: {
						id: req.params.id
					},
					include: {
						model: db.models.User,
						where: {
							id: user.id
						}
					}
				}).then(token => {
					if (!token) {
						res.status(404);
						res.json({ err: 'Not found' });
						return;
					}

					token.destroy();
					res.json({ msg: 'Deleted' });
				});
			}
		})
	);
};

export default tokens;
