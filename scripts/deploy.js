#!/usr/bin/env node

// Publish script to push releases of the bin files
// the normally are gitignored

var ghpages = require('gh-pages');
var path = require('path');
var options = {
    src: [
        '**/*',
        '!node_modules/**/*',
        '!git/**/*',
        '!npm-debug.log'
    ],
    dotfiles: true,
    branch: 'publish',
    message: 'Auto-generated commit',
    logger: console.log.bind(console)
};

ghpages.publish(process.cwd(), options, function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
        return;
    }
    process.exit(0);
});