import axios from 'axios';
import config from '../config';
import sessions from '../sessions';

const auth = app => {
	app.post('/api/auth', (req, res) => {
		axios
			.get(
				config.matrix.homeserver + '/_matrix/federation/v1/openid/userinfo',
				{
					params: {
						access_token: req.body.openIdToken
					}
				}
			)
			.then(
				resp => {
					if (!resp.data || resp.data.errcode) {
						res.status(400);
						res.json({ error: 'Invalid token' });
					}
					const token = sessions.create({ matrixId: resp.data.sub });

					res.json({ session: token });
				},
				() => {
					res.status(400);
					res.json({ error: 'Invalid token' });
				}
			);
	});
};

export default auth;
