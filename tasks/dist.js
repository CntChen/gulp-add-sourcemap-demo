/**
 * distrubution
 * 根据webpack打包的manifest，将html中的引用资源替换为打包后的文件
 * webpack资源引入语法:
 * <link rel="stylesheet" type="text/css" data-from-webpack href="./index.css">
 * <script type="text/javascript" data-from-webpack src="./index.js"></script>
 */

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var replace = require('gulp-replace');
var filelog = require('gulp-filelog');

var config = require('../config');

var webpackResourceReg = /<[\w\-"'=\.\/\s]*data-from-webpack[\w\-"'=\.\/\s]*>/g;

config.modeArr.forEach((mode) => {
  gulp.task(mode + ':' + 'dist-html', (done) => {
    var destDir = path.join(config.destDir, mode);
    var manifest = JSON.parse(fs.readFileSync(path.join(config.webpackDestDir, mode, config.manifestName)).toString());

    function resourcePathReplacer(match) {
      var jsTargetStr = match.replace(/\s/g, '').match(/src=["']([\w\-\.\/]*)["']/);
      var cssTargetStr = match.replace(/\s/g, '').match(/href=["']([\w\-\.\/]*)["']/);

      var targetStr = jsTargetStr || cssTargetStr;
      if (!targetStr) {
        throw new Error('资源引入语法错误');
      }

      var resourceName = targetStr[1];
      var absoluteName = resourceName.replace(/^([\.\..]\/)+/, '/');
      if (!manifest[absoluteName]) {
        throw new Error('引用的资源不存在');
      }

      return match.replace(absoluteName, manifest[absoluteName]).replace(/\s*data-from-webpack\s*/, ' ');
    }

    gulp.src(config.htmlGlob)
      .pipe(replace(webpackResourceReg, resourcePathReplacer))
      .pipe(gulp.dest(destDir))
      .on('end', done);
  });
});

config.modeArr.forEach((mode) => {
  gulp.task(mode + ':' + 'dist-resource', (done) => {
    var destDir = path.join(config.destDir, mode);
    resourceGlobArr =  typeof config.resourceGlob === 'string'? [config.resourceGlob]: config.resourceGlob;
    resourceGlobArr = resourceGlobArr.map((resourceGlob) => {
      return path.join(config.webpackDestDir, mode, resourceGlob)
    });

    gulp.src(resourceGlobArr)
    .pipe(gulp.dest(destDir))
    .on('end', done);
  });
});

config.modeArr.forEach((mode) => {
  gulp.task(mode + ':' + 'dist', [mode + ':' + 'dist-html', mode + ':' + 'dist-resource'], (done) => {
    done();
  });
});