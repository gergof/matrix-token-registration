import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';

import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import Authentication from './Authentication';
import SubmitToken from './SubmitToken';

const useStyles = makeStyles(theme => ({
	container: {
		width: '700px',
		margin: 'auto',
		marginTop: '10vh',
		display: 'flex'
	},
	loading: {
		margin: 'auto',
		position: 'absolute',
		top: '-75px',
		left: '-75px'
	},
	loadingContainer: {
		position: 'absolute',
		top: '50%',
		left: '50%'
	},
	background: {
		flex: 1,
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		minHeight: '100vh'
	},
	logoContainer: {
		width: '120px',
		padding: '10px',
		borderRight: `1px solid ${theme.palette.secondary.main}`,
		'& img': {
			maxWidth: '100px'
		}
	},
	content: {
		flex: 1,
		padding: theme.spacing(2)
	}
}));

const TokenRegistration = () => {
	const classes = useStyles();
	const [session, setSession] = useState(null);
	const [{ data, loading }] = useAxios('/config.json');

	if (loading) {
		return (
			<div className={classes.loadingContainer}>
				<CircularProgress className={classes.loading} size={150} />
			</div>
		);
	}

	return (
		<div
			className={classes.background}
			style={{
				backgroundImage: `url('${data.branding.welcomeBackgroundUrl}')`
			}}
		>
			<Paper className={classes.container}>
				<div className={classes.logoContainer}>
					<img src={data.branding.authHeaderLogoUrl} alt="logo" />
				</div>
				<div className={classes.content}>
					{session ? (
						<SubmitToken session={session} />
					) : (
						<Authentication config={data} setSession={setSession} />
					)}
				</div>
			</Paper>
		</div>
	);
};

TokenRegistration.propTypes = {};

export default TokenRegistration;
