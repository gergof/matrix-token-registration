import RandToken from 'rand-token';

class SessionStorage {
	constructor() {
		this.store = {};
	}

	init({ logger }) {
		return new Promise(resolve => {
			logger.log({ level: 'info', message: 'Initializing session store' });

			this.cleaner = setInterval(() => {
				let count = 0;
				Object.keys(this.store).map(session => {
					if (this.store[session].expires < Date.now()) {
						count++;
						delete this.store[session];
					}
				});
				logger.log({
					level: 'info',
					message: 'Cleaned ' + count + ' expired sessions'
				});
			}, 3600000);

			resolve();
		});
	}

	close() {
		return new Promise(resolve => {
			clearInterval(this.cleaner);
			resolve();
		});
	}

	create(info) {
		const token = RandToken.generate(32);
		this.store[token] = {
			info: info,
			expires: Date.now() + 3600000
		};
		return token;
	}

	delete(session) {
		delete this.store[session];
	}

	get(session) {
		if (!session) {
			return null;
		}
		if (!this.store[session]) {
			return null;
		}
		if (this.store[session].expires < Date.now()) {
			return null;
		}
		return {
			...this.store[session].info,
			sessionId: session
		};
	}

	update(session, patch) {
		const current = this.get(session);
		if (!current) {
			return false;
		}

		this.store[session].info = {
			...this.store[session].info,
			...patch
		};

		return this.get(session);
	}
}

const sessionStorage = new SessionStorage();

export default sessionStorage;
