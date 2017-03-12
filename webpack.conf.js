var path = require('path')
var projectRoot = path.join(__dirname)
var webpack = require('webpack');
var fs = require('fs')

module.exports = {
  entry: {
    index: './content.pack.js'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    libraryTarget: "umd"
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': "production"
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}