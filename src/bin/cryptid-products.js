import program from 'commander';

program
  .description('Product actions on a cryptid account')
  .command('list', 'List products for an account')
  .command('create', 'Create a new product')
  .command('update', 'Update a product')
  .parse(process.argv);
