#!/usr/bin/env node

// Publish script to push releases of the bin files
// the normally are gitignored

var ghpages = require('gh-pages');
var path = require('path');
var options = {
    src: [
        'bin/**/*.js',
        'bower.json',
        'package.json',
        'README.md'
    ],
    branch: 'release',
    message: 'Auto-generated commit',
    push: false,
    logger: console.log.bind(console)
};

ghpages.publish(__dirname, options, function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
        return;
    }
});