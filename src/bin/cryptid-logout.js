import chalk from 'chalk';
import {getPreferences} from './cli';

getPreferences().account = { token: '', email: '' };
process.exit();
