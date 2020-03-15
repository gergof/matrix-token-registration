import { Sequelize, Op } from 'sequelize';
import { validate, Joi } from 'express-validation';
import isAuthenticated from '../isAuthenticated';
import sessions from '../../sessions';

import inviterWorker from './workers/inviter';

const use = ({ db }) => app => {
	app.post(
		'/api/use',
		validate({
			body: Joi.object({
				token: Joi.string().required(),
				newUser: Joi.boolean()
			}).required()
		}),
		isAuthenticated((req, res, session) => {
			db.models.Token.findOne({
				where: {
					[Op.and]: [
						{ token: req.body.token },
						{
							[Op.or]: [
								{
									expiry: {
										[Op.is]: null
									}
								},
								{
									expiry: {
										[Op.gte]: Sequelize.literal('date("now")')
									}
								}
							]
						}
					]
				},
				include: [
					{ model: db.models.TokenUsage },
					{ model: db.models.TokenTarget }
				]
			}).then(token => {
				if (
					!token ||
					(token.type == 'single' && token.TokenUsages.length != 0)
				) {
					res.status(400);
					res.json({ error: 'Invalid token' });
					return;
				}

				const tokenUsage = db.models.TokenUsage.build({
					matrixId: session.matrixId,
					newUser: req.body.newUser || false
				});
				tokenUsage.setToken(token, { save: false });
				tokenUsage.save().then(() => {
					res.json({ msg: 'Inviting' });

					session = sessions.update(session.sessionId, {
						useProgress: {
							status: 'in progress',
							queue: token.TokenTargets.map(target =>
								target.get({ plain: true })
							),
							invited: []
						}
					});

					// start worker
					inviterWorker(session);
				});
			});
		})
	);

	app.get(
		'/api/use/status',
		isAuthenticated((req, res, session) => {
			if (!session.useProgress) {
				res.status(400);
				res.json({ error: 'No join running' });
				return;
			}

			if (session.useProgress.queue.length) {
				res.json(session.useProgress);
			} else {
				session.useProgress.status = 'done';
				res.json(session.useProgress);

				// clean session
				sessions.update(session.sessionId, {
					useProgress: null
				});
			}
		})
	);

	app.post(
		'/api/use/retry',
		isAuthenticated((req, res, session) => {
			if (!session.useProgress) {
				res.status(400);
				res.json({ error: 'No join running' });
				return;
			}

			res.json({ msg: 'Inviting' });

			// start worker
			inviterWorker(session);
		})
	);
};

export default use;
