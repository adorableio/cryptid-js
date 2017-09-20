import {
  LOGGER,
  SETTINGS,
  createProduct,
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import program from 'commander';

program
  .option('-a, --account-id <accountId>', 'Account to add the product to')
  .option('-n, --product-name <productName>', 'Name of the new product')
  .parse(process.argv);

SETTINGS.checkLogin();

if (!program.accountId) {
  LOGGER.info(chalk.red('Account id is required (use -a <accountId>)'));
  process.exit(1);
}

if (!program.productName) {
  LOGGER.error(chalk.red('Product name is required (use -n <productName>'));
  process.exit(1);
}

let {accountId, productName} = program;

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
