import sessions from '../../../sessions';
import { matrix } from '../../../matrix';

const targetJoiner = session => {
	if (!session.createToken) {
		return;
	}

	const job = session.createToken;
	const newStatus = { status: 'in progress', queue: [], joined: [] };

	// try to join rooms in the queue
	Promise.all(
		job.joinStatus.queue.map(target => {
			if (target.type == 'room') {
				return new Promise(resolve => {
					matrix.client.joinRoom(target.target).then(
						() => {
							resolve(true);
						},
						() => {
							resolve(false);
						}
					);
				});
			}
		})
	).then(results => {
		results.map((result, i) => {
			if (result) {
				newStatus.joined = [...newStatus.joined, job.joinStatus.queue[i]];
			} else {
				newStatus.queue = [...newStatus.queue, job.joinStatus.queue[i]];
			}
		});

		// commit changes
		job.joinStatus = newStatus;
		sessions.update(session.sessionId, { createToken: job });
	});
};

export default targetJoiner;
