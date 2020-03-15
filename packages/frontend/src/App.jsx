import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './style/theme';

import CssBaseline from '@material-ui/core/CssBaseline';

import TokenRegistration from './components/TokenRegistration';

const App = () => {
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<TokenRegistration />
		</MuiThemeProvider>
	);
};

App.propTypes = {};

export default App;
