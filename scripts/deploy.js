#!/usr/bin/env node

const ghpages = require('gh-pages');
const path = require('path');
const packageInfo = require(path.join(__dirname, '..', 'package.json'));
const options = {
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
        // eslint-disable-next-line no-console
        console.log(err);
        process.exit(1);
        return;
    }
    process.exit(0);
});