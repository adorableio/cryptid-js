import path from 'path';
import program from 'commander';

let version = require(path.join(__dirname, '../..', 'package.json'))
  .version;

program
  .version(version)
  .description('Admin interface to Cryptid Analytics')
  .command('login', 'Login to Cryptid')
  .command('user', 'User actions')
  .command('accounts', 'Account actions')
  .command('products', 'Product actions')
  // .command('properties', 'Interact with properties')
  .command('server', 'Display the currently-configured server endpoint')
  .command('logout', 'Logout of Cryptid')
  .parse(process.argv);
