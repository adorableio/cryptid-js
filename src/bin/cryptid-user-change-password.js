import {
  logger,
  preferences,
  server,
  updatePassword
} from './cli';

import chalk from 'chalk';
import inquirer from 'inquirer';
import program from 'commander';

program
  .description('Change the password of your Cryptid account')
  .option('-c, --current-password <currentPassword>', 'Your current password')
  .option('-n, --new-password <newPassword>', 'Your new password')
  .parse(process.argv);

let currentPassword = program.currentPassword;
let newPassword = program.newPassword;

if (preferences.needsLogin) {
  logger.info(chalk.red('You must first login with "cryptid login"'));
  process.exit(1);
}

function callUpdatePassword(old, updated) {
  updatePassword(old, updated, (error, response) => {
    if (error && error.code === 'ENOTFOUND') {
      logger.info(chalk.red(`Could not reach cryptid server. Is ${server} reachable?`));
      process.exit(1);
    }

    if (response.statusCode === 200) {
      logger.info(chalk.green('Your password has been updated'));
    } else {
      logger.info(response.statusCode);
      logger.info(chalk.red('An error has occurred'));
    }
  });
}

if (currentPassword && newPassword) {
  callUpdatePassword(currentPassword, newPassword);
} else {
  let questions = [];

  if (!currentPassword) {
    questions.push({
      type: 'password',
      name: 'currentPassword',
      message: 'Enter your current password:',
      validate: (entry) => entry.length > 0,
    });
  }

  if (!newPassword) {
    questions.push({
      type: 'password',
      name: 'newPassword',
      message: 'Enter your new password:',
      validate: (entry) => entry.length > 0,
    });

    questions.push({
      type: 'password',
      name: 'newPasswordConfirm',
      message: 'Enter your new password again:',
      validate: (entry) => entry.length > 0,
    });
  }

  inquirer.prompt(questions).then((answers) => {
    if (answers.currentPassword) currentPassword = answers.currentPassword;
    if (answers.newPassword) {
      if (answers.newPassword === answers.newPasswordConfirm) {
        newPassword = answers.newPassword;
      } else {
        logger.info(chalk.red('New password values do not match'));
        process.exit(1);
      }
    }

    callUpdatePassword(currentPassword, newPassword);
  });
}

