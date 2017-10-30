import {
  LOGGER,
  SETTINGS,
  createAccount
} from '../../cli';

import Table from 'easy-table';
import chalk from 'chalk';

exports.command = 'create <account-name>';
exports.desc = 'Create new account';
exports.builder = (yargs) => {
  yargs
    .positional('account-name', {
      description: 'Name of new account',
      type: 'string'
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  createAccount(argv.accountName, (response, body) => {
    if (response.statusCode === 201) {
      let t = new Table();

      let account = body.data;

      LOGGER.info(chalk.green(`Created account ${account.name}\n`));

      t.cell('id', account.id);
      t.cell('account name', account.name);
      t.newRow();

      LOGGER.info(t.toString());
    } else {
      LOGGER.info(chalk.red('Error creating account'));
      process.exit(1);
    }
  });
};
