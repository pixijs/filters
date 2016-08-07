#!/usr/bin/env node

// Publish script to push releases of the bin files
// the normally are gitignored

var ghpages = require('gh-pages');
var path = require('path');
var options = {
    src: [
        'bin/**/*',
        'scripts/**/*',
        'src/**/*',
        '.npmignore',
        'bower.json',
        'package.json',
        'README.md'
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