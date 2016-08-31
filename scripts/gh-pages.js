#!/usr/bin/env node

var ghpages = require('gh-pages');
var path = require('path');
var packageInfo = require(path.join(__dirname, '..', 'package.json'));
var options = {
    src: [
        'bin/filters.js',
        'bin/filters.js.map',
        'examples/**/*',
        'docs/**/*'
    ],
    message: packageInfo.version
};

ghpages.publish(process.cwd(), options, function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
        return;
    }
    process.exit(0);
});