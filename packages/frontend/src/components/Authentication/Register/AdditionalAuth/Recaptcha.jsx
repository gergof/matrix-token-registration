import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ReCaptcha from 'react-google-recaptcha';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
	heading: {
		marginBottom: theme.spacing(2)
	},
	captcha: {
		margin: 'auto',
		width: '304px'
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

const Recaptcha = ({ params, register }) => {
	const classes = useStyles();

	const [response, setResponse] = useState(null);

	const onVerify = useCallback(
		response => {
			setResponse(response);
		},
		[register]
	);

	const onSubmit = useCallback(() => {
		register({ auth: { type: 'm.login.recaptcha', response: response } });
	}, [response, register]);

	return (
		<React.Fragment>
			<Typography className={classes.heading}>
				Please verify that you're not a robot!
			</Typography>
			<div className={classes.captcha}>
				<ReCaptcha sitekey={params.public_key} onChange={onVerify} />
			</div>
			<div className={classes.buttonBar}>
				<Button
					className={classes.button}
					color="primary"
					variant="contained"
					onClick={onSubmit}
					disabled={!response}
				>
					Continue
				</Button>
			</div>
		</React.Fragment>
	);
};

Recaptcha.propTypes = {
	params: PropTypes.object,
	register: PropTypes.func
};

export default Recaptcha;
