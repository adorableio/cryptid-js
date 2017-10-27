import { LOGGER, SETTINGS, buildGQLClient } from '../../cli';

import chalk from 'chalk';
import csvify from 'csv-stringify';
import fs from 'fs';
import gql from 'graphql-tag';
import { loadHelp } from '../../help';

exports.command = 'run <graphql-file>';
exports.desc = 'Query the event store for a property';
exports.builder = (yargs) => {
  yargs
    .alias(['exec'])
    .usage(loadHelp('cryptid-query-run'))
    .positional('graphql-file', {
      description: 'Path to custom query document',
      type: 'string',
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

  try {
    queryDocument = fs.readFileSync(argv.graphqlFile, 'utf8');
  } catch (err) {
    LOGGER.error(chalk.red(err.message));
    process.exit(1);
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
