import {
  addUserToAccount,
  logger,
  preferences,
  server
} from './cli';

import chalk from 'chalk';
import program from 'commander';

program
  .option('-a, --account-id <accountId>', 'Account to add the user to')
  .option('-e, --email <email>', 'Email of the user to add')
  .parse(process.argv);

if (preferences.needsLogin) {
  logger.info(chalk.red('You must first login with "cryptid login"'));
  process.exit(1);
}

if (!program.email) {
  logger.info(chalk.red('Email is required (use -e <email>)'));
  process.exit(1);
}

if (!program.accountId) {
  logger.info(chalk.red('Account id is required (use -a <accountId>)'));
  process.exit(1);
}

addUserToAccount(program.accountId, program.email, (error, response, body) => {
  if (error && error.code === 'ENOTFOUND') {
    logger.info(chalk.red(`Could not reach cryptid server. Is ${server} reachable?`));
    process.exit(1);
  }

  if (response.statusCode === 201) {
    let {email, password} = body.data;
    logger.info(chalk.green('User was created and added to account. Give them the following credentials to use:\n'));
    logger.info(chalk.yellow(`  - Username: ${email}`));
    logger.info(chalk.yellow(`  - Password: ${password}\n`));
    logger.info('Once the user has logged in they may change their password with "cryptid user change-password"');
  } else if (response.statusCode === 200) {
    let {email} = body.data;
    logger.info(chalk.yellow(`Existing user ${email} was successfully added to the account.`));
  } else if (response.statusCode === 400) {
    logger.info(chalk.red(`The user ${program.email} already has access to that account`));
    process.exit(1);
  } else if (response.statusCode === 404) {
    logger.info(chalk.red('Account not found'));
    process.exit(1);
  } else if (response.statusCode === 403) {
    logger.info(chalk.red('Invalid account'));
    process.exit(1);
  }
});

