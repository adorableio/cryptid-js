
exports.command = 'products';
exports.desc = 'Product action';
exports.builder = (yargs) => {
  yargs
    .usage('Interact with Products')
    .commandDir('products')
    .demandCommand();
};
exports.handler = () => {};

