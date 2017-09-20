import {
  LOGGER,
  SERVER,
  SETTINGS,
  fetchCurrentUser
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';

if (SETTINGS.needsLogin) {
  LOGGER.info(chalk.red('You must first login with "cryptid login"'));
  process.exit(1);
}

fetchCurrentUser((error, response, body) => {
  if (error && error.code === 'ENOTFOUND') {
    LOGGER.info(chalk.red(`Could not reach cryptid SERVER. Is ${SERVER} reachable?`));
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

    LOGGER.info(t.toString());
  } else {
    LOGGER.info(chalk.red('Error fetching accounts'));
    process.exit(1);
  }
});
