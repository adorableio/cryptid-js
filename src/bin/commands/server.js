import {LOGGER, SERVER} from '../cli';

exports.command = 'server';
exports.desc = 'Display currently configured server';
exports.builder = {};
exports.handler = () => LOGGER.info(SERVER);
