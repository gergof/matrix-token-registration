import Dotenv from 'dotenv';
const requiredOptions = [
	'MATRIX_HOMESERVER',
	'BOT_USER',
	'BOT_TOKEN',
	'SERVER_ROOT_ACCOUNT'
];

if (process.env.NODE_ENV == 'production') {
	Dotenv.config({ path: '/data/config.env' });
} else {
	Dotenv.config();
}

requiredOptions.map(option => {
	if (!process.env[option]) {
		//eslint-disable-next-line no-console
		console.log('Error: Parameter ' + option + ' is required!');
		process.exit(1);
	}
});

const config = {
	matrix: {
		homeserver: process.env.MATRIX_HOMESERVER
	},
	bot: {
		user: process.env.BOT_USER,
		token: process.env.BOT_TOKEN
	},
	server: {
		port: process.env.SERVER_PORT || 3003,
		rootAccount: process.env.SERVER_ROOT_ACCOUNT
	}
};

export default config;
