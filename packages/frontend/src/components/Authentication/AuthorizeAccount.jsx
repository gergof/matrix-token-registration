import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
	heading: {
		marginBottom: theme.spacing(2)
	},
	button: {
		width: '240px'
	},
	buttonBar: {
		display: 'flex',
		justifyContent: 'space-around'
	},
	goBack: {
		marginTop: theme.spacing(4),
		display: 'block',
		margin: 'auto'
	},
	noToken: {
		fontStyle: 'italic'
	}
}));

const AuthorizeAccount = ({ config, back, setSession }) => {
	const classes = useStyles();

	const authorize = useCallback(() => {
		const token = `Bearer ${localStorage.getItem('mx_access_token')}`;
		axios
			.get(
				config.default_server_config['m.homeserver'].base_url +
					'/_matrix/client/r0/account/whoami',
				{
					headers: {
						Authorization: token
					}
				}
			)
			.then(resp => {
				return axios.post(
					config.default_server_config['m.homeserver'].base_url +
						`/_matrix/client/r0/user/${resp.data.user_id}/openid/request_token`,
					{},
					{
						headers: {
							Authorization: token
						}
					}
				);
			})
			.then(resp => {
				setSession(resp.data.access_token);
			})
			.catch(() => {
				alert('Invalid token. Please log out and log in to Riot!');
			});
	}, [config]);

	return (
		<React.Fragment>
			<Typography className={classes.heading}>
				We will try to authorize your account based on your matrix login. Please
				make sure that you are signed in to Riot!
			</Typography>
			{localStorage.getItem('mx_access_token') ? (
				<div className={classes.buttonBar}>
					<Button
						className={classes.button}
						color="primary"
						variant="contained"
						onClick={authorize}
					>
						Authorize
					</Button>
				</div>
			) : (
				<Typography className={classes.noToken}>
					Riot access token not found. Please make sure that you are signed in!
				</Typography>
			)}
			<Link component="button" onClick={back} className={classes.goBack}>
				Or go back
			</Link>
		</React.Fragment>
	);
};

AuthorizeAccount.propTypes = {
	config: PropTypes.object,
	back: PropTypes.func,
	setSession: PropTypes.func
};

export default AuthorizeAccount;
