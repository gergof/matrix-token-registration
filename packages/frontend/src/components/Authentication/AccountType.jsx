import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
	}
}));

const AccountType = ({ setAccountType }) => {
	const classes = useStyles();

	const onExistingClick = useCallback(() => {
		setAccountType('existing');
	}, [setAccountType]);
	const onRegisterClick = useCallback(() => {
		setAccountType('register');
	}, [setAccountType]);

	return (
		<React.Fragment>
			<Typography variant="h5" className={classes.heading}>
				Do you have an account?
			</Typography>
			<div className={classes.buttonBar}>
				<Button
					className={classes.button}
					color="primary"
					variant="contained"
					onClick={onExistingClick}
				>
					I already have an account
				</Button>
				<Button
					className={classes.button}
					color="primary"
					variant="contained"
					onClick={onRegisterClick}
				>
					Register now
				</Button>
			</div>
		</React.Fragment>
	);
};

AccountType.propTypes = {
	setAccountType: PropTypes.func
};

export default AccountType;
