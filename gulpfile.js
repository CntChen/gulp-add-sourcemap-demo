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

gulp.task('webpack-normal:test', (done) => {
  runSequence('webpack-normal:clear-dist', 'webpack-normal:webpack', 'webpack-normal:dist', done);
});

gulp.task('webpack-sourcemap:test', (done) => {
  runSequence('webpack-sourcemap:clear-dist', 'webpack-sourcemap:webpack', 'webpack-sourcemap:dist', done);
});

gulp.task('uglify-sourcemap:test', (done) => {
  runSequence('uglify-sourcemap:clear-dist', 'uglify-sourcemap:webpack', 'uglify-sourcemap:dist', 'uglify', done);
});

gulp.task('test', (done) => {
  runSequence('clear-dist', 'webpack-normal:test', 'webpack-sourcemap:test', 'uglify-sourcemap:test', done);
});