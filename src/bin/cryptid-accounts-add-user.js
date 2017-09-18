import {addUserToAccount, getPreferences} from './cli';

import chalk from 'chalk';
import program from 'commander';

program
  .option('-a, --account-id <accountId>', 'Account to add the user to')
  .option('-e, --email <email>', 'Email of the user to add')
  .parse(process.argv);

let prefs = getPreferences();

if (prefs.needsLogin) {
  console.log(chalk.red('You must first login with "cryptid login"'));
  process.exit(1);
}

if (!program.email) {
  console.log(chalk.red('Email is required (use -e <email>)'));
  process.exit(1);
}

if (!program.accountId) {
  console.log(chalk.red('Account id is required (use -a <accountId>)'));
  process.exit(1);
}

addUserToAccount(program.accountId, program.email, (error, response, body) => {
  if (error && error.code == 'ENOTFOUND') {
    console.log(chalk.red(`Could not reach cryptid server. Is ${getServer()} reachable?`));
    process.exit(1);
  }

  if (response.statusCode === 201) {
    let {email, password} = body.data;
    console.log(chalk.green('User was successfully created and added to account. Give them the following credentials to use:\n'));
    console.log(chalk.yellow(`  - Username: ${email}`));
    console.log(chalk.yellow(`  - Password: ${password}\n`));
    console.log('Once the user has logged in they may change their password with "cryptid user change-password"');
  } else if (response.statusCode === 200) {
    let {email} = body.data;
    console.log(chalk.yellow(`Existing user ${email} was successfully added to the account.`));
  } else if (response.statusCode === 400) {
    console.log(chalk.red(`The user ${program.email} already has access to that account`));
    process.exit(1);
  } else if (response.statusCode === 404) {
    console.log(chalk.red('Account not found'));
    process.exit(1);
  } else if (response.statusCode === 403) {
    console.log(chalk.red('Invalid account'));
    process.exit(1);
  }
});

