import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import DoneIcon from '@material-ui/icons/Done';

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
	},
	check: {
		fill: theme.palette.primary.main,
		marginRight: theme.spacing(1)
	},
	spinner: {
		marginRight: theme.spacing(1)
	}
}));

const SubmitToken = ({ session }) => {
	const classes = useStyles();

	const [token, setToken] = useState(window.location.hash.substr(1));

	const [joinProgress, setJoinProgress] = useState(null);

	const getStatus = useCallback(() => {
		axios
			.get('api/use/status', {
				headers: {
					Authorization: session
				}
			})
			.then(resp => {
				console.log(resp);
				setJoinProgress(resp.data);
				if (resp.data.status != 'done') {
					setTimeout(getStatus, 300);
				}
			});
	}, [session, setJoinProgress]);

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
					return axios.get('api/use/status', {
						headers: {
							Authorization: session
						}
					});
				})
				.then(resp => {
					setJoinProgress(resp.data);
					if (resp.data.status != 'done') {
						setTimeout(getStatus, 300);
					}
				})
				.catch(() => {
					alert('Invalid token');
				});
		},
		[session, setJoinProgress]
	);

	const goToRiot = useCallback(() => {
		window.location = '/';
	});

	return (
		<React.Fragment>
			{!joinProgress ? (
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
			) : (
				<React.Fragment>
					<Typography>You are being invited to:</Typography>
					<List>
						{joinProgress.invited.map(target => (
							<ListItem key={target.id}>
								<DoneIcon className={classes.check} />
								<Typography>{target.target}</Typography>
							</ListItem>
						))}
						{joinProgress.queue.map(target => (
							<ListItem key={target.id}>
								<CircularProgress className={classes.spinner} size={24} />
								<Typography>{target.target}</Typography>
							</ListItem>
						))}
					</List>
					{joinProgress.status == 'done' ? (
						<div className={classes.buttonBar}>
							<Button
								className={classes.button}
								color="primary"
								variant="contained"
								onClick={goToRiot}
							>
								Go to the application
							</Button>
						</div>
					) : null}
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

SubmitToken.propTypes = {
	session: PropTypes.string
};

export default SubmitToken;
