import {
  LOGGER,
  SETTINGS,
  updateProduct
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import program from 'commander';

program
  .option('-a, --account-id <accountId>', 'ID of account containing product')
  .option('-p, --product-id <productId>', 'ID of product to update')
  .option('-n, --product-name <productName>', 'Updated name of the product')
  .parse(process.argv);

SETTINGS.checkLogin();

if (!program.accountId) {
  LOGGER.error(chalk.red('Account ID is required (use -a <accountId>)'));
  process.exit(1);
}

if (!program.productId) {
  LOGGER.error(chalk.red('Product ID is required (use -p <productId>)'));
  process.exit(1);
}

if (!program.productName) {
  LOGGER.error(chalk.red('Product name is required (use -n <productName>)'));
  process.exit(1);
}

updateProduct(program, (response, body) => {
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
