var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var recursiveReadSync = require('recursive-readdir-sync');
var ManifestPlugin = require('webpack-manifest-plugin');

var config = require('./config');

function makeWebpackConfig(options) {
  var plugins = [
    new CleanWebpackPlugin(path.join(config.webpackDestDir, options.mode), {
      verbose: false,
    }),
    /* css抽成单独文件 */
    new ExtractTextPlugin('[name].[contenthash:8].css', {
      allChunks: true
    }),
    new ManifestPlugin({
      fileName: config.manifestName,
    }),
    ];

  if(options.mode != 'webpack'){
    plugins.push(new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }));
  }

  var webpackConfig = {
    entry: genEntryMap(config.webpackEntryDir),
    output: {
      publicPath: '/',
      path: path.join(config.webpackDestDir, options.mode),
      filename: '[name].[hash:8].js',
      chunkFilename:'js/[name].[chunkhash:8].chunk.js',
    },
    plugins: plugins,
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'babel?presets[]=es2015',
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
      }, ]
    },
  };

  return webpackConfig;
}

/**
 * 生成entry map
 * @param  {string} entryDir
 * @return {object}
 */
function genEntryMap(entryDir) {
  var entryMap = {};

  var allFilePaths = recursiveReadSync(path.join(__dirname, entryDir));
  allFilePaths.forEach(function(filePath) {
    var match = filePath.match(new RegExp(path.basename(entryDir) + '([\\w\\W]*)\\.js$'));
    var entryName = match ? match[1] : '';

    if (entryName) {
      if (entryMap[entryName]) {
        throw new Error('entry命名同名冲突, 请重新命名\n' + filePath);
      } else {
        entryMap[entryName] = [filePath];
      }
    }
  });

  return entryMap;
}


module.exports = makeWebpackConfig;