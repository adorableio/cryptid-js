import {
  LOGGER,
  SETTINGS,
  addUserToAccount
} from '../../cli';

import chalk from 'chalk';

exports.command = 'add-user <email>';
exports.desc = 'Add user to account';
exports.builder = (yargs) => {
  yargs
    .positional('email', {
      description: 'Email of user to add',
      type: 'string',
    })
    .option('account-id', {
      description: 'Account id to add user to',
      alias: 'a',
      required: true,
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  addUserToAccount(argv.accountId, argv.email, (response, body) => {
    if (response.statusCode === 201) {
      let { email, password } = body.data;
      LOGGER.info(chalk.green('User was created and added to account. Give them the following credentials to use:\n'));
      LOGGER.info(chalk.yellow(`  - Username: ${email}`));
      LOGGER.info(chalk.yellow(`  - Password: ${password}\n`));
      LOGGER.info('Once the user has logged in they may change their password with "cryptid user change-password"');
    } else if (response.statusCode === 200) {
      let { email } = body.data;
      LOGGER.info(chalk.yellow(`Existing user ${email} was successfully added to the account.`));
    } else if (response.statusCode === 400) {
      LOGGER.error(chalk.red(`The user ${argv.email} already has access to that account`));
      process.exit(1);
    } else if (response.statusCode === 404) {
      LOGGER.error(chalk.red('Account not found'));
      process.exit(1);
    } else if (response.statusCode === 403) {
      LOGGER.error(chalk.red('Invalid account'));
      process.exit(1);
    }
  });
};
