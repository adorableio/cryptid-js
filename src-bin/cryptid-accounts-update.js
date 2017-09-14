import {getPreferences, updateAccount} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import program from 'commander';

program
  .option('-a, --account-id <accountId>', 'Id of account to update')
  .option('-n, --account-name <accountName>', 'Account name')
  .parse(process.argv)

let prefs = getPreferences();

if (prefs.needsLogin) {
  console.log(chalk.red('You must first login with "cryptid login"'));
  process.exit(1);
}

if(!program.accountName) {
  console.log(chalk.red('Account name is required (use -n <accountName>)'));
  process.exit(1);
}

if(!program.accountId) {
  console.log(chalk.red('Account id is required (use -a <accountId>)'));
  process.exit(1);
}

updateAccount(program.accountId, program.accountName, (error, response, body) => {
  if (error && error.code == 'ENOTFOUND') {
    console.log(chalk.red(`Could not reach cryptid server. Is ${getServer()} reachable?`))
    process.exit(1);
  }

  if (response.statusCode === 200) {
    let t = new Table();

    let account = body.data;

    console.log(chalk.green(`Updated account ${account.name}\n`));

    t.cell('id', account.id);
    t.cell('account name', account.name);
    t.newRow();

    console.log(t.toString());
  } else {
    console.log(response.statusCode);
    console.log(chalk.red('Error updating account'));
    process.exit(1);
  }
});