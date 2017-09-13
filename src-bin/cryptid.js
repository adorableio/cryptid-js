import program from 'commander';

program
  .version('0.1.0')
  .command('login', 'login to cryptid')
  .command('logout', 'logout of cryptid')
  .command('accounts', 'interact with accounts')
  .command('products', 'interact with products')
  .command('properties', 'interact with properties')
  .parse(process.argv);
