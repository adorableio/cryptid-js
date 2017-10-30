import {
  LOGGER,
  SETTINGS,
  updateProperty
} from '../../cli';

import Table from 'easy-table';
import chalk from 'chalk';
import { head } from 'lodash';

exports.command = 'update <property-name>';
exports.desc = 'Updates property';
exports.builder = (yargs) => {
  yargs
    .positional('property-name', {
      desc: 'New name of the property',
      type: 'string'
    })
    .option('account-id', {
      desc: 'Account ID of property to update',
      alias: 'a',
      type: 'number',
      required: true,
    })
    .option('product-id', {
      desc: 'Product ID of property to update',
      alias: 'p',
      type: 'number',
      required: true,
    })
    .option('property-id', {
      desc: 'Property ID of property to update',
      alias: 'r',
      type: 'number',
      required: true,
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  updateProperty(argv, (response, body) => {
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
};
