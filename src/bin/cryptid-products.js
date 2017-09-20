import program from 'commander';

program
  .description('Product actions on a cryptid account')
  .command('list', 'List products for an account')
  .parse(process.argv);
