import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
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

const SubmitToken = ({ session }) => {
	const classes = useStyles();

	const [token, setToken] = useState(window.location.hash.substr(1));

	const onSubmit = useCallback(
		token => {
			axios
				.post(
					'api/use',
					{
						token: token
					},
					{
						headers: {
							Authorization: session
						}
					}
				)
				.then(() => {
					console.log('join triggered');
				});
		},
		[session]
	);

	return (
		<React.Fragment>
			<TextField
				className={classes.input}
				value={token}
				onChange={e => setToken(e.target.value)}
				helperText="Your invitation token"
				required
				label="Token"
				variant="outlined"
			/>
			<div className={classes.buttonBar}>
				<Button
					className={classes.button}
					color="primary"
					variant="contained"
					onClick={() => onSubmit(token)}
					disabled={!token}
				>
					Submit
				</Button>
			</div>
		</React.Fragment>
	);
};

SubmitToken.propTypes = {
	session: PropTypes.string
};

export default SubmitToken;
