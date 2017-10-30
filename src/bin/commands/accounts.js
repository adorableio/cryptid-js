
exports.command = 'accounts';
exports.desc = 'Account actions';
exports.builder = (y) => {
  y.usage('Interact with Cryptid accounts')
    .commandDir('accounts')
    .demandCommand();
};
exports.handler = () => {};
