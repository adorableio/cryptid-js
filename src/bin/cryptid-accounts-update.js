import {
  logger,
  preferences,
  server,
  updateAccount
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import program from 'commander';

program
  .option('-a, --account-id <accountId>', 'Id of account to update')
  .option('-n, --account-name <accountName>', 'Account name')
  .parse(process.argv);

if (preferences.needsLogin) {
  logger.info(chalk.red('You must first login with "cryptid login"'));
  process.exit(1);
}

if (!program.accountName) {
  logger.info(chalk.red('Account name is required (use -n <accountName>)'));
  process.exit(1);
}

if (!program.accountId) {
  logger.info(chalk.red('Account id is required (use -a <accountId>)'));
  process.exit(1);
}

updateAccount(program.accountId, program.accountName, (error, response, body) => {
  if (error && error.code === 'ENOTFOUND') {
    logger.info(chalk.red(`Could not reach cryptid server. Is ${server} reachable?`));
    process.exit(1);
  }

  if (response.statusCode === 200) {
    let t = new Table();

    let account = body.data;

    logger.info(chalk.green(`Updated account ${account.name}\n`));

    t.cell('id', account.id);
    t.cell('account name', account.name);
    t.newRow();

    logger.info(t.toString());
  } else {
    logger.info(response.statusCode);
    logger.info(chalk.red('Error updating account'));
    process.exit(1);
  }
});
