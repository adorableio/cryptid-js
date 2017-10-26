import { loadHelp } from '../help';

exports.command = 'properties';
exports.desc = 'Property actions';
exports.builder = (yargs) => {
  yargs
    .usage(loadHelp('cryptid-properties'))
    .commandDir('properties')
    .demandCommand();
};
exports.handler = () => {};
