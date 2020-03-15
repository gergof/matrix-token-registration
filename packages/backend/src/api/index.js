import auth from './auth';
import users from './admin/users';
import tokens from './admin/tokens';
import use from './user/use';

const api = [auth, users, tokens, use];

export default api;
