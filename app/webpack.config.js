'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const OUTPUT_PATH = path.resolve(__dirname, 'dist')
const ENTRY = path.resolve(__dirname, 'src/app.js')

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    'bootstrap-loader',
    ENTRY
  ],
  output: {
    path: OUTPUT_PATH,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['babel'],
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=8192'
    }, {
      test: /\.(woff2?|ttf|eot|svg)$/,
      loader: 'url?limit=100000'
    }, {
      test: /bootstrap-sass\/assets\/javascripts\//,
      loader: 'imports?jQuery=jquery'
    }, {
      test: /\.md$/,
      loader: "html!markdown"
    }, {
      test: /\.svg$/,
      loader: 'file-loader'
    }]
  },
  postcss: function (webpack) {
    return [
      require('postcss-import')({ addDependencyTo: webpack }),
      require('precss')(),
      require('autoprefixer')({ browsers: ['last 2 versions'] })
    ];
  },
  resolve: {
    extensions: ['', '.js']
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
    }),
    new HtmlWebpackPlugin({
      title: 'UofT BioHacks',
      template: 'template.html',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
