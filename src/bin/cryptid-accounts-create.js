import {createAccount, getPreferences} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import program from 'commander';

program
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

createAccount(program.accountName, (error, response, body) => {
  if (error && error.code == 'ENOTFOUND') {
    console.log(chalk.red(`Could not reach cryptid server. Is ${getServer()} reachable?`))
    process.exit(1);
  }

  if (response.statusCode === 201) {
    let t = new Table();

    let account = body.data;

    console.log(chalk.green(`Created account ${account.name}\n`));

    t.cell('id', account.id);
    t.cell('account name', account.name);
    t.newRow();

    console.log(t.toString());
  } else {
    console.log(chalk.red('Error creating account'));
    process.exit(1);
  }
});