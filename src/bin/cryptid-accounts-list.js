import {
  fetchCurrentUser,
  getServer,
  logger,
  preferences
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';

if (preferences.needsLogin) {
  logger.info(chalk.red('You must first login with "cryptid login"'));
  process.exit(1);
}

fetchCurrentUser((error, response, body) => {
  if (error && error.code === 'ENOTFOUND') {
    logger.info(chalk.red(`Could not reach cryptid server. Is ${getServer()} reachable?`));
    process.exit(1);
  }

  if (response.statusCode === 200) {
    let t = new Table();

    let user = JSON.parse(body).data;

    user.accounts.forEach((account) => {
      t.cell('id', account.id);
      t.cell('account name', account.name);
      t.newRow();
    });

    logger.info(t.toString());
  } else {
    logger.info(chalk.red('Error fetching accounts'));
    process.exit(1);
  }
});
