import {SETTINGS} from './cli';

SETTINGS.token = '';
SETTINGS.email = '';
SETTINGS.loggedIn = false;
delete SETTINGS.checkLogin;

process.exit();
