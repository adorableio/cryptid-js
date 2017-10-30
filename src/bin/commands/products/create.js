import {
  LOGGER,
  SETTINGS,
  createProduct,
} from '../../cli';

import Table from 'easy-table';
import chalk from 'chalk';

exports.command = 'create <product-name>';
exports.desc = 'Create a new product';
exports.builder = (yargs) => {
  yargs
    .positional('product-name', {
      desc: 'Name of the new product',
      type: 'string',
    })
    .option('account-id', {
      desc: 'Account ID to create product under',
      alias: 'a',
      type: 'number',
      required: true,
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  let { accountId, productName } = argv;

  createProduct(accountId, productName, (response, body) => {
    if (response.statusCode === 201) {
      let t = new Table();

      let product = body.data;

      LOGGER.info(chalk.green(`Created product ${product.name}\n`));

      t.cell('ID', product.id);
      t.cell('Product Name', product.name);
      t.newRow();

      LOGGER.info(t.toString());
    } else {
      LOGGER.error(chalk.red('Error creating product'));
      process.exit(1);
    }
  });
};
