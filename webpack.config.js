var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './client/index',
  output: {
    path: path.join(__dirname, 'public/dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'client')
      }
    ]
  }
};
