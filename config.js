var path = require('path');

const destDir = './dist';
const webpackDestDir = './_tmp';

const config = {
  modeArr: ['webpack-normal', 'webpack-sourcemap', 'uglify-sourcemap'],

  tasksDir: './tasks',
  webpackEntryDir: './src',
  webpackDestDir: webpackDestDir,
  destDir: destDir,

  uglifySrc: path.join(destDir, 'uglify-sourcemap', '/**/*.js'),
  // uglifySrc: path.join(destDir, 'uglify-sourcemap', '/**/*.js'),
  uglifyDest: path.join(destDir, 'uglify-sourcemap'),

  manifestName: 'manifest.json',

  htmlGlob: './src/**/*.html',
  resourceGlob: ['/**/*.js', '/**/*.css', '/**/*.map'],

}


module.exports = config;