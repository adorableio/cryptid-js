import program from 'commander';

program
  .command('change-password', 'Change the password of the current user')
  .parse(process.argv);
