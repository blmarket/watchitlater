var you = require('./youtube');

console.log(process.argv);
var id = process.argv[process.argv.length-1];

you.download(id, function(err, res) {
    process.exit(0);
});
