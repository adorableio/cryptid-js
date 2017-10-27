
exports.command = 'query';
exports.desc = 'Query actions';
exports.builder = (yargs) => {
  yargs
    .commandDir('query')
    .usage('Do some queries!');
};
exports.handler = () => {};
