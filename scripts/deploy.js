#!/usr/bin/env node

const ghpages = require('gh-pages');
const packageInfo = require('../lerna.json');
const options = {
    src: [
        'filters/all/lib/pixi-filters.js',
        'filters/all/lib/pixi-filters.js.map',
        'examples/**/*',
        'docs/**/*',
        'tools/screenshots/dist/*'
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