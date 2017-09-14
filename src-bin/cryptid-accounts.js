import program from 'commander';

program
  .command('list', 'List accessible accounts')
  .command('create', 'Create new account')
  .parse(process.argv);