import {
  LOGGER,
  SERVER,
  SETTINGS,
  createAccount
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import program from 'commander';

program
  .option('-n, --account-name <accountName>', 'Account name')
  .parse(process.argv);


if (SETTINGS.needsLogin) {
  LOGGER.info(chalk.red('You must first login with "cryptid login"'));
  process.exit(1);
}

if (!program.accountName) {
  LOGGER.info(chalk.red('Account name is required (use -n <accountName>)'));
  process.exit(1);
}

createAccount(program.accountName, (error, response, body) => {
  if (error && error.code === 'ENOTFOUND') {
    LOGGER.info(chalk.red(`Could not reach cryptid SERVER. Is ${SERVER} reachable?`));
    process.exit(1);
  }

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
