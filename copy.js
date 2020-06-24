var args = process.argv.slice(2);
console.log('args');
console.log(args);

var path = require('path');
var cwd = process.cwd();
var source = path.join(cwd, args[0]);
var destination = path.join(cwd, args[1]);
console.log('source:' + source + ', dest:' + destination);
require('fs').copyFile(source, destination, function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log(source + ' successfully copied!');
});
