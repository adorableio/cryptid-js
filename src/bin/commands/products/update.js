import {
  LOGGER,
  SETTINGS,
  updateProduct
} from '../../cli';

import Table from 'easy-table';
import chalk from 'chalk';

exports.command = 'update <product-name>';
exports.desc = 'Updates the specified product';
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
    })
    .option('product-id', {
      desc: 'Product ID of the product to update',
      alias: 'p',
      type: 'number',
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  updateProduct(argv, (response, body) => {
    if (response.statusCode === 200) {
      let t = new Table();

      let product = body.data;

      LOGGER.info(chalk.green(`Updated product ${product.name}\n`));

      t.cell('ID', product.id);
      t.cell('Product Name', product.name);
      t.newRow();

      LOGGER.info(t.toString());
    } else {
      LOGGER.error(chalk.red('Error updating product'));
      process.exit(1);
    }
  });
};
