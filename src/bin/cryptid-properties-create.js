import {
  LOGGER,
  SETTINGS,
  createProperty
} from './cli';

import Table from 'easy-table';
import chalk from 'chalk';
import {head} from 'lodash';
import program from 'commander';

program
  .description('Create new property for a given account and product')
  .option('-a, --account-id <accountId>', 'Account to create the property under')
  .option('-p, --product-id <productId>', 'Product to create the property under')
  .option('-n, --property-name <name>', 'Property name')
  .option('-t, --property-type <type>', 'Type of property (web or mobile)')
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

if (!program.propertyName) {
  LOGGER.error(chalk.red('Property name is required (use -n <propertyName>)'));
  process.exit(1);
}

if (!program.propertyType) {
  LOGGER.error(chalk.red('Property type is required (use -t web or -t mobile)'));
  process.exit(1);
}

createProperty(program, (response, body) => {
  if (response.statusCode === 201) {
    LOGGER.info(chalk.green('Property was created successfully'));
    let t = new Table();

    let property = body.data;

    t.cell('ID', property.id);
    t.cell('Property Name', property.name);
    t.cell('Type', head(property.trackerId.split('|')));
    t.cell('Tracker ID', property.trackerId);
    t.newRow();

    LOGGER.info(t.toString());
  } else {
    LOGGER.error(chalk.red('Error creating property'));
    process.exit(1);
  }
});
