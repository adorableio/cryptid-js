
exports.command = 'user';
exports.desc = 'User actions';
exports.builder = (yargs) => {
  yargs
    .usage('Interact with user profile')
    .commandDir('user')
    .demandCommand();
};
exports.handler = () => {};
