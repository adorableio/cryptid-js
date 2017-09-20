import {
  LOGGER,
  SETTINGS,
  fetchCurrentUser,
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import {find} from 'lodash';
import program from 'commander';

program
  .option('-a, --account-id <accountId>', 'Account to fetch products for')
  .parse(process.argv);

SETTINGS.checkLogin();

if (!program.accountId) {
  LOGGER.error(chalk.red('Account id is required (use -a <accountId>)'));
  process.exit(1);
}

fetchCurrentUser((response, body) => {
  if (response.statusCode === 200) {
    let account = find(body.data.accounts, {id: parseInt(program.accountId, 10)});

    if (account) {
      let t = new Table();

      account.products.forEach((product) => {
        t.cell('ID', product.id);
        t.cell('Product Name', product.name);
        t.newRow();
      });

      LOGGER.info(t.toString());
    } else {
      LOGGER.error(chalk.red(`Invalid account id: ${program.accountId}`));
      process.exit(1);
    }
  } else {
    LOGGER.error(chalk.red('Error fetching products'));
    process.exit(1);
  }
});
