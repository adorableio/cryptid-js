import program from 'commander';

program
  .version('0.1.0')
  .command('login', 'Login to cryptid')
  .command('accounts', 'Interact with accounts')
  .command('products', 'Interact with products')
  .command('properties', 'Interact with properties')
  .command('logout', 'Logout of cryptid')
  .parse(process.argv);
