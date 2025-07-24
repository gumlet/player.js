const path = require('path')
const webpack = require('webpack')
const packageProperties = require('./package.json')

const { banner, entry, externals, rules, resolve } = require('./webpack.config.js')

module.exports = {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname)
    },
    port: 8080
  },
  entry,
  externals,
  resolve,
  output: {
    path: path.resolve('./dist/debug'),
    // for dev-server
    publicPath: './dist/debug',
    filename: 'player.min.js',
    libraryTarget: 'umd'
  },
  module: {
    rules
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(packageProperties.version)
    })
  ],
  devtool: 'inline-source-map'
}
