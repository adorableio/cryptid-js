import {LOGGER, SETTINGS, buildGQLClient} from './cli';

import chalk from 'chalk';
import csvify from 'csv-stringify';
import fs from 'fs';
import gql from 'graphql-tag';
import program from 'commander';

program
  .option('-g, --graph-ql <queryDocument>', 'Custom query document')
  .option('-t, --tracker-id <trackerId>', 'Tracker to fetch events for')
  .option('-f, --format <format>', 'Output format', /^(csv|json)$/i, 'csv')
  .parse(process.argv);

SETTINGS.checkLogin();

const client = buildGQLClient();
let queryDocument = '';

if (program.graphQl) {
  queryDocument = fs.readFileSync(program.graphQl, 'utf8');
} else {
  queryDocument = `{ events(tracker_id: "${program.trackerId}") { event_value } }`;
}

const queryOpts = {
  query: gql(queryDocument)
};

client.query(queryOpts)
  .catch(err => LOGGER.error(chalk.red(err)) && process.exit(1))
  .then(resp => {

    switch (program.format) {
      case 'json':
        LOGGER.info(JSON.stringify(resp.data));
        break;
      case 'csv':
      default:
        const opts = {header: true};
        if (resp.data.events) {
          const events = resp.data.events.map(event => {
            // eslint-disable-next-line no-unused-vars
            let {__typename, ...mappedEvent} = event;
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

