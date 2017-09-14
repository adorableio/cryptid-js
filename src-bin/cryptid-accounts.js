import program from 'commander';

program
  .command('list', 'List accessible accounts')
  .command('create', 'Create new account')
  .command('update', 'Update account')
  .parse(process.argv);