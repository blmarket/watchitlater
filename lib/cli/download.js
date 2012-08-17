var fetch = require('../cache_fetcher');

function usage() {
    console.log("Usage: [url]");
}

var url = process.argv.pop();
console.log(url);

if(url[0] === '/') { // not a url?
    return usage();
}

fetch.get_by_url(url);
