#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var packageInfo = require(path.join(__dirname, '..', 'package.json'));
var bowerPath = path.join(__dirname, '..', 'bower.json');
var bowerInfo = require(bowerPath);
bowerInfo.version = packageInfo.version;
fs.writeFileSync(bowerPath, JSON.stringify(bowerInfo, null, '  '));