import {
  LOGGER,
  SETTINGS,
  fetchCurrentUser,
} from '../../cli';

import Table from 'easy-table';
import chalk from 'chalk';
import { filter } from 'lodash';

exports.command = 'list';
exports.desc = 'List accessible products';
exports.builder = (yargs) => {
  yargs
    .option('account-id', {
      desc: 'Account ID to fetch products for',
      alias: 'a',
      type: 'number',
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  fetchCurrentUser((response, body) => {
    if (response.statusCode === 200) {
      let products = [];

      body.data.accounts.forEach((account) => {
        account.products.forEach((product) => {
          products.push({
            ...product,
            accountId: account.id,
            accountName: account.name,
          });
        });
      });

      if (argv.accountId) {
        let accountId = parseInt(argv.accountId, 10);
        products = filter(products, { accountId });
      }

      if (products.length === 0) {
        LOGGER.info(chalk.yellow('No matching properties found'));
        process.exit();
      }

      let t = new Table();

      products.forEach((product) => {
        t.cell('ID', product.id);
        t.cell('Product Name', product.name);
        t.cell('Account Name (ID)', `${product.accountName} (${product.accountId})`);
        t.newRow();
      });

      t.sort(['Account Name (ID)', 'Product Name']);

      LOGGER.info(t.toString());
    } else {
      LOGGER.error(chalk.red('Error fetching products'));
      process.exit(1);
    }
  });
};
