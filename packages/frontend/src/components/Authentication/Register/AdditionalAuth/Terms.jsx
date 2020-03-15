import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
	link: {
		flexGrow: 1
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

const getPolicyInfo = (policies, policy) => {
	return policies[policy][
		Object.keys(policies[policy]).reduce(
			(acc, cur) => (acc == 'version' ? cur : acc),
			'version'
		)
	];
};

const Terms = ({ params, register }) => {
	const classes = useStyles();

	const [accepted, setAccepted] = useState(
		Object.keys(params.policies).reduce(
			(acc, cur) => ({ ...acc, [cur]: false }),
			{}
		)
	);

	const toggleAccept = useCallback(
		policy => {
			setAccepted({
				...accepted,
				[policy]: !accepted[policy]
			});
		},
		[accepted, setAccepted]
	);

	const onAccept = useCallback(() => {
		register({ auth: { type: 'm.login.terms' } });
	});

	return (
		<React.Fragment>
			<Typography className={classes.heading}>
				You are required to accept the following terms!
			</Typography>
			<div>
				{Object.keys(params.policies).map(policy => (
					<Grid container alignItems="center" key={policy}>
						<Grid item>
							<Checkbox
								checked={accepted[policy]}
								onChange={() => toggleAccept(policy)}
							/>
						</Grid>
						<Grid item className={classes.link}>
							<Link
								href={getPolicyInfo(params.policies, policy).url}
								target="_blank"
							>
								{getPolicyInfo(params.policies, policy).name}
							</Link>
						</Grid>
					</Grid>
				))}
			</div>
			<div className={classes.buttonBar}>
				<Button
					className={classes.button}
					color="primary"
					variant="contained"
					onClick={onAccept}
					disabled={
						!Object.keys(accepted).reduce(
							(acc, cur) => acc && accepted[cur],
							true
						)
					}
				>
					Continue
				</Button>
			</div>
		</React.Fragment>
	);
};

Terms.propTypes = {
	params: PropTypes.object,
	register: PropTypes.func
};

export default Terms;
