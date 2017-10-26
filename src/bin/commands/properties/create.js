import {
  LOGGER,
  SETTINGS,
  createProperty
} from '../../cli';

import Table from 'easy-table';
import chalk from 'chalk';
import { head } from 'lodash';

exports.command = 'create <property-name>';
exports.desc = 'Creates a new property';
exports.builder = (yargs) => {
  yargs
    .option('account-id', {
      desc: 'Account ID to create property under',
      alias: 'a',
      type: 'number',
      required: true,
    })
    .option('product-id', {
      desc: 'Product ID to create property under',
      alias: 'p',
      type: 'number',
      required: true,
    })
    .option('property-type', {
      desc: 'Type of property to create',
      choices: ['web', 'mobile'],
      required: true,
      alias: 't',
      type: 'string',
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  createProperty(argv, (response, body) => {
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
};
