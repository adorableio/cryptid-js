import {logger, login, preferences} from './cli';

import chalk from 'chalk';
import inquirer from 'inquirer';
import program from 'commander';

program
  .option('-u, --username <username>', 'Cryptid username')
  .option('-p, --password <password>', 'Cryptid password')
  .parse(process.argv);

let username = program.username;
let password = program.password;

let {account} = preferences;
if (account.token.length > 0 && account.email.length > 0) {
  logger.info(chalk.yellow(`You are already logged-in as ${account.email}`));
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
