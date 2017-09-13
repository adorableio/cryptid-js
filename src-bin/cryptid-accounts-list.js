import {fetchCurrentUser, getPreferences} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';

let prefs = getPreferences();

if (prefs.needsLogin) {
  console.log(chalk.red('You must first login with "cryptid login"'));
  process.exit(1);
}

fetchCurrentUser(prefs.account.token, (error, response, body) => {
  if (response.statusCode === 200) {
    let t = new Table();

    let user = JSON.parse(body).data;

    console.log(`${prefs.account.email} has access to the following accounts:\n`);

    user.accounts.forEach((account) => {
      t.cell('id', account.id);
      t.cell('account name', account.name);
      t.newRow();
    });

    console.log(t.toString());
  } else {
    console.log(chalk.red('Error fetching accounts'));
    process.exit(1);
  }
});