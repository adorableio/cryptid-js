import { LOGGER } from '../../cli';
import chalk from 'chalk';
import fs from 'fs';
import { head } from 'lodash';
import { loadHelp } from '../../help';

function generateView(trackerId) {
  return `
  view(trackerId: "${trackerId}", name: "last_week", filters: {eventValue: "change me!"}) {
    name
    lines {
      interval
      date
      label
      value
    }
  }
`;
}

function generateWebEvents(trackerId) {
  return `
  events(trackerId: "${trackerId}", start: "2017-01-01", end: "2017-12-31") {
    id
    eventCategory
    eventAction
    eventLabel
    eventValue
    customField_1
    customField_2
    customField_3
    customField_4
    customField_5
    documentLocationUrl
    documentReferer
    documentEncoding
    documentTitle
    documentHostname
    documentPath
    userLanguage
    screenResolution
    viewportSize
    screenColors
  }
`;
}

function generateMobileEvents(trackerId) {
  return `
  events(trackerId: "${trackerId}", start: "2017-01-01", end: "2017-12-31") {
    id
    eventCategory
    eventAction
    eventLabel
    eventValue
    customField_1
    customField_2
    customField_3
    customField_4
    customField_5
    device_manufacturer
    device_brand
    device_model
    device_id
    device_locale
    device_country
    device_name
    system_name
    system_version
    bundle_id
    build_number
    app_version
    app_version_readable
    app_instance_id
    user_agent
    timezone
    latitude
    longitude
    elevation
    is_emulator
    is_tablet
  }
`;
}

function getPropertyType(trackerId) {
  return head(trackerId.split('|'));
}

exports.command = 'generate <tracker-id> <graphql-file>';
exports.desc = 'Generate base GraphQL query file';
exports.builder = (yargs) => {
  yargs
    .usage(loadHelp('cryptid-query-generate'))
    .option('events', {
      desc: 'Generate an events query',
      type: 'boolean',
    })
    .option('view', {
      desc: 'Generate a view query',
      type: 'boolean'
    })
    .positional('tracker-id', {
      desc: 'Tracker ID to generate query for',
      type: 'string'
    })
    .positional('graphql-file', {
      desc: 'Path to output the new query file',
      type: 'string',
    });
};
exports.handler = (argv) => {
  let {trackerId} = argv;
  let propertyType = getPropertyType(trackerId);
  let queries = [];

  if (argv.view) {
    queries.push(generateView(trackerId));
  }
  if (argv.events && propertyType === 'web') {
    queries.push(generateWebEvents(trackerId));
  }
  if (argv.events && propertyType === 'mobile') {
    queries.push(generateMobileEvents(trackerId));
  }

  let fileContents = `{
  ${queries.join('\n')}
}
`;

  try {
    fs.writeFileSync(argv.graphqlFile, fileContents);
  } catch (err) {
    LOGGER.error(chalk.red(err.message));
    process.exit(1);
  }
};
