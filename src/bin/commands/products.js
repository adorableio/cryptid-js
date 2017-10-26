
// program
//   .description('Product actions on a cryptid account')
//   .command('list', 'List products for an account')
//   .command('create', 'Create a new product')
//   .command('update', 'Update a product')
//   .parse(process.argv);

exports.command = 'products';
exports.desc = 'Product action';
exports.builder = (yargs) => {
  yargs
    .usage('Interact with Products')
    .commandDir('products')
    .demandCommand();
};
exports.handler = () => {};

