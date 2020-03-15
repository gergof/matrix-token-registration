import { matrix } from '../../../matrix';
import sessions from '../../../sessions';

const inviter = session => {
	const newProgress = { status: 'in progress', queue: [], invited: [] };
	Promise.all(
		session.useProgress.queue.map(target => {
			if (target.targetType == 'room') {
				return new Promise(resolve => {
					if (target.target.charAt(0) == '#') {
						// we need to resolve the alias
						matrix.client
							.getRoomIdForAlias(target.target)
							.then(room => {
								return matrix.client.invite(room.room_id, session.matrixId);
							})
							.then(() => {
								resolve(true);
							})
							.catch(() => {
								resolve(false);
							});
					} else {
						matrix.client.invite(target.target, session.matrixId).then(
							() => {
								resolve(true);
							},
							() => {
								resolve(false);
							}
						);
					}
				});
			}
		})
	).then(results => {
		results.map((result, i) => {
			if (result) {
				newProgress.invited = [
					...newProgress.invited,
					session.useProgress.queue[i]
				];
			} else {
				newProgress.queue = [
					...newProgress.queue,
					session.useProgress.queue[i]
				];
			}
		});

		// update session
		sessions.update(session.sessionId, {
			useProgress: newProgress
		});
	});
};

export default inviter;
