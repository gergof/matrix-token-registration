import sessions from '../sessions';

const isAuthenticated = handler => (req, res) => {
	const session = sessions.get(req.headers.authorization);
	if (!session) {
		res.status(403);
		res.json({ error: 'Unauthenticated' });
		return;
	}

	return handler(req, res, session);
};

export default isAuthenticated;
