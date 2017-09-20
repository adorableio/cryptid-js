import {
  LOGGER,
  SETTINGS,
  fetchCurrentUser
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';

SETTINGS.checkLogin();

fetchCurrentUser((response, body) => {
  if (response.statusCode === 200) {
    let t = new Table();

    let user = body.data;

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
