import program from 'commander';

program
  .command('list', 'List accessible accounts')
  .parse(process.argv);