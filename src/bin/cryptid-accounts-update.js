import {
  LOGGER,
  SERVER,
  SETTINGS,
  updateAccount
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import program from 'commander';

program
  .option('-a, --account-id <accountId>', 'Id of account to update')
  .option('-n, --account-name <accountName>', 'Account name')
  .parse(process.argv);

SETTINGS.checkLogin();

if (!program.accountName) {
  LOGGER.info(chalk.red('Account name is required (use -n <accountName>)'));
  process.exit(1);
}

if (!program.accountId) {
  LOGGER.info(chalk.red('Account id is required (use -a <accountId>)'));
  process.exit(1);
}

updateAccount(program.accountId, program.accountName, (error, response, body) => {
  if (error && error.code === 'ENOTFOUND') {
    LOGGER.info(chalk.red(`Could not reach cryptid SERVER. Is ${SERVER} reachable?`));
    process.exit(1);
  }

  if (response.statusCode === 200) {
    let t = new Table();

    let account = body.data;

    LOGGER.info(chalk.green(`Updated account ${account.name}\n`));

    t.cell('id', account.id);
    t.cell('account name', account.name);
    t.newRow();

    LOGGER.info(t.toString());
  } else {
    LOGGER.info(response.statusCode);
    LOGGER.info(chalk.red('Error updating account'));
    process.exit(1);
  }
});
