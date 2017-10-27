import {loadHelp} from './help';

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .commandDir('commands')
  .demandCommand()
  .help()
  .usage(loadHelp('cryptid'))
  .version()
  .argv;
