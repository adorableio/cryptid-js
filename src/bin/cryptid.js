import {loadHelp} from './help';

//   .command('products', 'Product actions')
//   .command('properties', 'Property actions')
//   .command('query', 'Query the event store for a property')

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .commandDir('commands')
  .demandCommand()
  .help()
  .usage(loadHelp('cryptid'))
  .version()
  .argv;
