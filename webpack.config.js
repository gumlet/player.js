const webpack = require('webpack');
const execSync = require('child_process').execSync;
const packageProperties = require('./package.json');

const banner =
        '\n' +
        'Copyright (C) ' + new Date().getFullYear() + ', Gumlet Pte Ltd., All Rights Reserved\n' +
        '\n' +
        'This source code and its use and distribution, is subject to the terms\n' +
        'and conditions of the applicable license agreement.\n' +
        '\n' +
        packageProperties.name + ' version ' + packageProperties.version + '\n';

const entry = './src/main.js';

let rules = [{
  test   : /\.js$/,
  exclude: /node_modules/,
  loader : 'babel-loader'
}];

const externals = {
};

module.exports = {
  banner,
  entry,
  externals,
  rules
};
