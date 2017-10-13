import {loadHelp, loadVersion} from './help';

import program from 'commander';

program
  .version(loadVersion())
  .description(loadHelp('cryptid'))
  .command('login', 'Login to Cryptid')
  .command('logout', 'Logout of Cryptid')
  .command('user', 'User actions')
  .command('accounts', 'Account actions')
  .command('products', 'Product actions')
  .command('properties', 'Property actions')
  .command('query', 'Query the event store for a property')
  .command('server', 'Display the currently-configured server endpoint')
  .command('version', 'Print version')
  .parse(process.argv);
