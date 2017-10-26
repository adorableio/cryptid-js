import {
  LOGGER,
  SETTINGS,
  fetchCurrentUser
} from '../../cli';
import { filter, head } from 'lodash';

import Table from 'easy-table';
import chalk from 'chalk';

exports.command = 'list';
exports.desc = 'Lists accessible properties';
exports.builder = (yargs) => {
  yargs
    .option('account-id', {
      desc: 'Account ID to fetch properties for',
      alias: 'a',
      type: 'number',
    })
    .option('product-id', {
      desc: 'Product ID to fetch properties for',
      alias: 'p',
      type: 'number',
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  fetchCurrentUser((response, body) => {
    let properties = [];

    body.data.accounts.forEach((account) => {
      account.products.forEach((product) => {
        product.properties.forEach((property) => {
          properties.push({
            ...property,
            accountId: account.id,
            accountName: account.name,
            productId: product.id,
            productName: product.name,
          });
        });
      });
    });

    if (argv.accountId) {
      let accountId = parseInt(argv.accountId, 10);
      properties = filter(properties, { accountId });
    }

    if (argv.productId) {
      let productId = parseInt(argv.productId, 10);
      properties = filter(properties, { productId });
    }

    if (properties.length === 0) {
      LOGGER.info(chalk.yellow('No matching properties found'));
      process.exit();
    }

    let t = new Table();

    properties.forEach((property) => {
      t.cell('ID', property.id);
      t.cell('Property Name', property.name);
      t.cell('Type', head(property.trackerId.split('|')));
      t.cell('Tracker', property.trackerId);
      t.cell('Product (ID)', `${property.productName} (${property.productId})`);
      t.cell('Account (ID)', `${property.accountName} (${property.accountId})`);
      t.newRow();
    });

    t.sort(['Account (ID)', 'Product (ID)', 'Property Name']);

    LOGGER.info(t.toString());
  });

};
