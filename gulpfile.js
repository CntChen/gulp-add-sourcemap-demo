var gulp = require('gulp');
var webpack = require('webpack');
var gulpUglify = require('gulp-uglify');
var gulpSourcemap = require('gulp-sourcemap');
var runSequence = require('run-sequence');
var requireDir = require('require-dir');

var config = require('./config');

requireDir(config.tasksDir); // 引入task下的所有任务

gulp.task('default', (done) => {
  done();
});

gulp.task('test-webpack-sourcemap', (done) => {
  runSequence('clear-dist', 'webpack', done);
});

gulp.task('test-uglify-sourcemap', (done) => {
  runSequence('clear-dist', 'webpack', 'uglify', done);
});