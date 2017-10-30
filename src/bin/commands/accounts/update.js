import {
  LOGGER,
  SETTINGS,
  updateAccount
} from '../../cli';

import Table from 'easy-table';
import chalk from 'chalk';

exports.command = 'update <account-id> <account-name>';
exports.desc = 'Update account name';
exports.builder = (yargs) => {
  yargs
    .positional('account-id', {
      description: 'Account ID of account to update',
      type: 'integer'
    })
    .positional('account-name', {
      description: 'New account name',
      type: 'string'
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  updateAccount(argv.accountId, argv.accountName, (response, body) => {
    if (response.statusCode === 200) {
      let t = new Table();

      let account = body.data;

      LOGGER.info(chalk.green(`Updated account ${account.name}\n`));

      t.cell('id', account.id);
      t.cell('account name', account.name);
      t.newRow();

      LOGGER.info(t.toString());
    } else {
      LOGGER.error(chalk.red('Error updating account'));
      process.exit(1);
    }
  });
};
