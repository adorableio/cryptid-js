import {SETTINGS} from '../cli';

exports.command = 'logout';
exports.desc = 'Logout from Cryptid';
exports.builder = {};
exports.handler = () => SETTINGS.clear();