import {
  LOGGER,
  SETTINGS,
  login
} from '../cli';

import chalk from 'chalk';
import inquirer from 'inquirer';

exports.command = 'login';
exports.desc = 'Login to Cryptid';
exports.builder = (y) => {
  return y.option('username', { description: 'Username', alias: 'u', required: false })
    .option('password', { description: 'Password', alias: 'p', required: false });
};
exports.handler = (argv) => {
  let [username, password] = [argv.username, argv.password];

  if (SETTINGS.loggedIn) {
    LOGGER.info(chalk.yellow(`You are already logged-in as ${SETTINGS.email}`));
    process.exit();
  }

  if (username && password) {
    login(username, password);
  } else {
    let questions = [];

    if (!username) {
      questions.push({
        type: 'input',
        name: 'username',
        message: 'Enter your username:',
        validate: (entry) => entry.length > 0,
      });
    }

    if (!password) {
      questions.push({
        type: 'password',
        name: 'password',
        message: 'Enter your password:',
        validate: (entry) => entry.length > 0,
      });
    }

    inquirer.prompt(questions).then((answers) => {
      if (answers.username) username = answers.username;
      if (answers.password) password = answers.password;

      login(username, password);
    });
  }
};
