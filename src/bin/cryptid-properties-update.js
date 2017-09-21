import {
  LOGGER,
  SETTINGS,
  updateProperty
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import {head} from 'lodash';
import program from 'commander';

program
  .description('Updates a property')
  .option('-a, --account-id <accountId>', 'Account to create the property under')
  .option('-p, --product-id <productId>', 'Product to create the property under')
  .option('-r, --property-id <propertyId>', 'Property to change')
  .option('-n, --property-name <name>', 'Property name')
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

if (!program.propertyId) {
  LOGGER.error(chalk.red('Property ID is required (use -r <propertyId>)'));
  process.exit(1);
}

if (!program.propertyName) {
  LOGGER.error(chalk.red('Property name is required (use -n <propertyName>)'));
  process.exit(1);
}

updateProperty(program, (response, body) => {
  if (response.statusCode === 200) {
    LOGGER.info(chalk.green('Property was updated successfully'));
    let t = new Table();

    let property = body.data;

    t.cell('ID', property.id);
    t.cell('Property Name', property.name);
    t.cell('Type', head(property.trackerId.split('|')));
    t.cell('Tracker ID', property.trackerId);
    t.newRow();

    LOGGER.info(t.toString());
  } else {
    LOGGER.error(chalk.red('Error updating property'));
    process.exit(1);
  }
});
