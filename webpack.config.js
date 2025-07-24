const packageProperties = require('./package.json')

const banner =
        '\n' +
        'Copyright (C) ' + new Date().getFullYear() + ', Gumlet Pte Ltd., All Rights Reserved\n' +
        '\n' +
        'This source code and its use and distribution, is subject to the terms\n' +
        'and conditions of the applicable license agreement.\n' +
        '\n' +
        packageProperties.name + ' version ' + packageProperties.version + '\n'

const entry = './src/main.ts'

const rules = [{
  test: /\.ts$/,
  exclude: /node_modules/,
  use: 'ts-loader'
}]

const externals = {
}

const resolve = {
  extensions: ['.ts', '.js']
}

module.exports = {
  banner,
  entry,
  externals,
  rules,
  resolve
}
