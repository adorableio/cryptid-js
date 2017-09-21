import {loadHelp} from './cli';
import program from 'commander';

program
  .description(loadHelp('cryptid-properties'))
  .command('list', 'List accessible properties')
  .command('create', 'Create property')
  .command('update', 'Update a property')
  .parse(process.argv);
