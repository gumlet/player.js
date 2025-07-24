const WriteJsonPlugin = require('generate-json-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const packageProperties = require('./package.json')
const { banner, entry, externals, rules, resolve } = require('./webpack.config.js')

const releasePackageJson = {
  name: packageProperties.name,
  // version: getGitVersion(),
  version: packageProperties.version,
  description: 'Gumlet Player.JS allows you to control gumlet player from your website',
  license: 'MIT',
  repository: {
    type: 'git',
    url: 'https://github.com/gumlet/player.js'
  },
  main: 'player.js',
  readme: 'Please visit: https://github.com/gumlet/player.js/blob/main/README.md',
  author: 'Gumlet Pte. Ltd.',
  homepage: 'https://github.com/gumlet/player.js/blob/main/README.md',
  bugs: {
    url: 'https://www.gumlet.com/contact/'
  },
  maintainers: [{
    name: 'Gumlet Team',
    email: 'support@gumlet.com'
  }]
}

module.exports = {
  mode: 'production',
  entry,
  externals,
  resolve,
  output: {
    path: path.resolve('./dist'),
    filename: 'player.min.js',
    libraryTarget: 'umd'
  },
  module: {
    rules
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   output: {
    //     comments: false
    //   }
    // }),
    new webpack.BannerPlugin(banner),
    new WriteJsonPlugin('package.json', releasePackageJson),
    new webpack.DefinePlugin({
      // __VERSION__: JSON.stringify(getGitVersion())
      __VERSION__: JSON.stringify(releasePackageJson.version)
    })
  ]
}
