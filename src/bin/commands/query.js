import { LOGGER, SETTINGS, buildGQLClient } from '../cli';

import chalk from 'chalk';
import csvify from 'csv-stringify';
import fs from 'fs';
import gql from 'graphql-tag';

exports.command = 'query <tracker-id>';
exports.desc = 'Query the event store for a property';
exports.builder = (yargs) => {
  yargs
    .option('graph-ql', {
      description: 'Path to custom query document',
      alias: 'g',
      type: 'string'
    })
    .option('format', {
      description: 'Results format (json or csv)',
      alias: 'f',
      choices: ['csv', 'json'],
      type: 'string',
      default: 'csv',
    });
};
exports.handler = (argv) => {
  SETTINGS.checkLogin();

  const client = buildGQLClient();
  let queryDocument = '';

  if (argv.graphQl) {
    try {
      queryDocument = fs.readFileSync(argv.graphQl, 'utf8');
    } catch (err) {
      LOGGER.error(chalk.red(err.message));
      process.exit(1);
    }
  } else {
    queryDocument = `{ events(tracker_id: "${argv.trackerId}") { event_value } }`;
  }

  try {
    client.query({query: gql(queryDocument)})
      .catch(err => LOGGER.error(chalk.red(err)) && process.exit(1))
      .then(resp => {

        switch (argv.format) {
          case 'json':
            LOGGER.info(JSON.stringify(resp.data));
            break;
          case 'csv':
          default:
            const opts = { header: true };
            if (resp.data.events) {
              const events = resp.data.events.map(event => {
                // eslint-disable-next-line no-unused-vars
                let { __typename, ...mappedEvent } = event;
                return mappedEvent;
              });
              if (events.length > 0) {
                csvify(events, opts, (err, output) => {
                  LOGGER.info(output);
                });
              }
            }

            const view = resp.data.view;
            if (view) {
              csvify(view.lines, opts, (err, output) => {
                LOGGER.info(`Event Summary: ${view.name}`);
                LOGGER.info('----------------------------------------------------');
                LOGGER.info(output);
              });
            }
            break;
        }
      });
  } catch (err) {
    LOGGER.error(chalk.red(err.message));
    process.emit(1);
  }
};
