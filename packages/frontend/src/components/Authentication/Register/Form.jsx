import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
	heading: {
		marginBottom: theme.spacing(2)
	},
	input: {
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	button: {
		width: '240px'
	},
	buttonBar: {
		display: 'flex',
		justifyContent: 'space-around',
		marginTop: theme.spacing(3)
	}
}));

const Form = ({config, register }) => {
	const classes = useStyles();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConf, setPasswordConf] = useState('');

	return (
		<React.Fragment>
			<Typography className={classes.heading}>
				You are going to register a new Matrix account on the{' '}
				{config.default_server_config['m.homeserver'].server_name} homeserver.
			</Typography>
			<TextField
				className={classes.input}
				value={username}
				onChange={e => setUsername(e.target.value)}
				helperText="Can only contain alphanumeric characters."
				error={!!(username && !username.match(/^[a-zA-Z0-9]+$/))}
				required
				label="Username"
				variant="outlined"
			/>
			<TextField
				className={classes.input}
				value={password}
				onChange={e => setPassword(e.target.value)}
				helperText="Minimum 8 characters long."
				error={!!(password && password.length < 8)}
				required
				label="Password"
				type="password"
				variant="outlined"
			/>
			<TextField
				className={classes.input}
				value={passwordConf}
				onChange={e => setPasswordConf(e.target.value)}
				error={!!(passwordConf && passwordConf != password)}
				required
				label="Confirm password"
				type="password"
				variant="outlined"
			/>
			<div className={classes.buttonBar}>
				<Button
					className={classes.button}
					color="primary"
					variant="contained"
					onClick={() => register({ username, password })}
					disabled={
						!!(
							password.length < 8 ||
							passwordConf != password ||
							!username.match(/^[a-zA-Z0-9]+$/)
						)
					}
				>
					Register
				</Button>
			</div>
		</React.Fragment>
	);
};

Form.propTypes = {
	register: PropTypes.func
};

export default Form;
