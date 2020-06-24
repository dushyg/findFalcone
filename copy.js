var args = process.argv.slice(2);
console.log('args');
console.log(args);

require('fs').copyFile(args[0], args[1], function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log(args[0] + ' successfully copied!');
});
