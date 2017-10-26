import {
  LOGGER,
  SETTINGS,
  updatePassword
} from '../../cli';

import chalk from 'chalk';
import inquirer from 'inquirer';

exports.command = 'change-password';
exports.desc = 'Change password on your Cryptid user account';
exports.builder = {};
exports.handler = () => {
  SETTINGS.checkLogin();

  let questions = [];

  questions.push({
    type: 'password',
    name: 'currentPassword',
    message: 'Enter your current password:',
    validate: (entry) => entry.length > 0,
  });

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

  inquirer.prompt(questions).then((answers) => {
    updatePassword(answers, (response) => {
      if (response.statusCode === 200) {
        LOGGER.info(chalk.green('Your password has been updated'));
      } else {
        LOGGER.error(chalk.red('An error has occurred. Password not updated.'));
        process.exit(1);
      }
    });
  });
};
