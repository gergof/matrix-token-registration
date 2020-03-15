import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import AccountType from './AccountType';
import AuthorizeAccount from './AuthorizeAccount';
import Register from './Register';

const Authentication = ({ config, setSession }) => {
	const [accountType, setAccountType] = useState(null);

	const back = useCallback(() => {
		setAccountType(null);
	}, [setAccountType]);

	return !accountType ? (
		<AccountType setAccountType={setAccountType} />
	) : accountType == 'existing' ? (
		<AuthorizeAccount config={config} back={back} setSession={setSession} />
	) : (
		<Register config={config} back={back} setSession={setSession} />
	);
};

Authentication.propTypes = {
	config: PropTypes.object,
	setSession: PropTypes.func
};

export default Authentication;
