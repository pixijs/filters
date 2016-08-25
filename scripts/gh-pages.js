#!/usr/bin/env node

var ghpages = require('gh-pages');
var path = require('path');
var options = {
    src: [
        'bin/filters.js',
        'bin/filters.js.map',
        'examples/**/*',
        'docs/**/*'
    ]
};

ghpages.publish(process.cwd(), options, function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
        return;
    }
    process.exit(0);
});