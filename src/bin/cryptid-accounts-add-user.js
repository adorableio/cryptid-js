import {
  LOGGER,
  SETTINGS,
  addUserToAccount
} from './cli';

import chalk from 'chalk';
import program from 'commander';

program
  .option('-a, --account-id <accountId>', 'Account to add the user to')
  .option('-e, --email <email>', 'Email of the user to add')
  .parse(process.argv);

SETTINGS.checkLogin();

if (!program.email) {
  LOGGER.info(chalk.red('Email is required (use -e <email>)'));
  process.exit(1);
}

if (!program.accountId) {
  LOGGER.info(chalk.red('Account id is required (use -a <accountId>)'));
  process.exit(1);
}

addUserToAccount(program.accountId, program.email, (response, body) => {
  if (response.statusCode === 201) {
    let {email, password} = body.data;
    LOGGER.info(chalk.green('User was created and added to account. Give them the following credentials to use:\n'));
    LOGGER.info(chalk.yellow(`  - Username: ${email}`));
    LOGGER.info(chalk.yellow(`  - Password: ${password}\n`));
    LOGGER.info('Once the user has logged in they may change their password with "cryptid user change-password"');
  } else if (response.statusCode === 200) {
    let {email} = body.data;
    LOGGER.info(chalk.yellow(`Existing user ${email} was successfully added to the account.`));
  } else if (response.statusCode === 400) {
    LOGGER.error(chalk.red(`The user ${program.email} already has access to that account`));
    process.exit(1);
  } else if (response.statusCode === 404) {
    LOGGER.error(chalk.red('Account not found'));
    process.exit(1);
  } else if (response.statusCode === 403) {
    LOGGER.error(chalk.red('Invalid account'));
    process.exit(1);
  }
});

