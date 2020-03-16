import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import Form from './Form';
import AdditionalAuth from './AdditionalAuth';

const useStyles = makeStyles(theme => ({
	heading: {
		marginBottom: theme.spacing(2)
	},
	goBack: {
		marginTop: theme.spacing(4),
		display: 'block',
		margin: 'auto'
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

const Register = ({ config, back, setSession }) => {
	const classes = useStyles();

	const [isLoading, setIsLoading] = useState(false);
	const [additionalAuth, setAdditionalAuth] = useState([]);
	const [regSession, setRegSession] = useState(null);
	const [userCred, setUserCred] = useState({});

	const register = useCallback(
		({ username, password, auth }) => {
			if (username && password) {
				setUserCred({ username, password });
			}

			axios
				.post(
					config.default_server_config['m.homeserver'].base_url +
						'/_matrix/client/r0/register',
					{
						auth: auth
							? { ...auth, session: regSession }
							: {
									type: 'm.login.dummy'
							  },
						username: username || userCred.username,
						password: password || userCred.password
					}
				)
				.then(resp => {
					setIsLoading(true);

					// clear list, since we succeeded
					setAdditionalAuth([]);

					// save access token to log in directly to Riot
					localStorage.setItem('mx_access_token', resp.data.access_token);

					// get openID token
					return axios.post(
						config.default_server_config['m.homeserver'].base_url +
							`/_matrix/client/r0/user/${resp.data.user_id}/openid/request_token`,
						{},
						{
							headers: {
								Authorization: `Bearer ${resp.data.access_token}`
							}
						}
					);
				})
				.then(resp => {
					return axios.post('api/auth', {
						openIdToken: resp.data.access_token
					});
				})
				.then(resp => {
					setSession(resp.data.session);
				})
				.catch(err => {
					if (err.response.status == 400) {
						if (err.response.data.errcode == 'M_USER_IN_USE') {
							alert('Username already taken. Please try an other one!');
							return;
						}
					}
					if (err.response.status == 401) {
						if (!additionalAuth.length) {
							setRegSession(err.response.data.session);
							setAdditionalAuth(
								err.response.data.flows[0].stages.map(stage => ({
									type: stage,
									params: err.response.data.params[stage]
								}))
							);
						} else {
							setAdditionalAuth(additionalAuth.slice(1));
						}
						return;
					}

					alert('Some error occured. Please try again later!');
					setIsLoading(false);
				});
		},
		[
			config,
			regSession,
			setRegSession,
			additionalAuth,
			setAdditionalAuth,
			userCred,
			setUserCred,
			setIsLoading
		]
	);

	const AdditionalAuthComponent =
		additionalAuth.length && AdditionalAuth[additionalAuth[0].type];

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<React.Fragment>
			{!additionalAuth.length ? (
				<Form config={config} register={register} />
			) : (
				<AdditionalAuthComponent
					params={additionalAuth[0].params}
					register={register}
				/>
			)}
			<Link component="button" onClick={back} className={classes.goBack}>
				Or go back
			</Link>
		</React.Fragment>
	);
};

Register.propTypes = {
	config: PropTypes.object,
	back: PropTypes.func,
	setSession: PropTypes.func
};

export default Register;
