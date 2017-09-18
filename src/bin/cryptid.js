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
  // .command('products', 'Interact with products')
  // .command('properties', 'Interact with properties')
  .command('logout', 'Logout of Cryptid')
  .parse(process.argv);
