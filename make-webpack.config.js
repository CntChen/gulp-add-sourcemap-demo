var config = require('./config');
var path = require('path');

var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var extractLESS = new ExtractTextPlugin('bundle.css', {
  allChunks: true,
});

var production = process.env.NODE_ENV === 'production';

var plugins = [
  new CleanPlugin('builds'),
  extractLESS,
  new webpack.optimize.CommonsChunkPlugin({
    name: 'main',
    children: true,
    minChunks: 2,
  }),
  new HtmlWebpackPlugin({
    title: 'webpack test',
    filename: './index.html',
    template: './src/index.html'
  })
];

if (production) {
  plugins = plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200, // ~50kb
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
      },
    }),
    new webpack.DefinePlugin({
      __SERVER__: !production,
      __DEVELOPMENT__: !production,
      __DEVTOOLS__: !production,
      'process.env': {
        BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]);
}

module.exports = {
  debug: !production,
  devtool: production ? false : 'eval',
  entry: './src',
  output: {
    publicPath: '',
    path: path.join(config.path.dist),
    filename: production ? '[name]-[hash].js' : '[name].js',
    chunkFilename: production ? './js/[name]-[chunkhash].js' : './js/[name].js',
  },
  plugins: plugins,
  module: {
    preLoaders: [
      /*{
            test: /\.js$/,
            loader: 'eslint',
          }*/
    ],
    loaders: [{
      test: /\.js$/,
      include: /src/,
      loader: 'babel-loader',
    }, {
      test: /\.less$/,
      loader: extractLESS.extract('style', 'css!less'),
    }, {
      test: /\.html$/,
      loader: 'html',
    }, {
      test: /\.(png|gif|jpe?g|svg)$/i,
      loader: 'url',
      query: {
        limit: 10000,
        name: './images/[name].[ext]',
      },
    }],
    postLoaders: [],
  },
  devServer: production ? {} : {
    port: 8080,
    contentBase: 'builds',
    hot: true,
    historyApiFallback: true,
    publicPath: "",
    stats: {
      colors: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }
};