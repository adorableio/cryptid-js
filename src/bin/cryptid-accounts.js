import program from 'commander';

program
  .command('list', 'List accessible accounts')
  .command('create', 'Create new account')
  .command('update', 'Update account')
  .command('add-user', 'Adds user to account')
  .parse(process.argv);
