var path = require('path');

var gulp = require('gulp');
var rimraf = require('rimraf');
var config = require('../config');

function reverse_curry_rimraf(cb) {
  return (path) => {
    rimraf(path, cb)
  };
}

config.modeArr.forEach((mode) => {
  gulp.task(mode + ':' + 'clear-dist', (done) => {
    var destDirArr = typeof config.destDir === 'string' ? [config.destDir] : config.destDir;
    destDirArr = destDirArr.map((dest) => {
      return path.join(config.destDir, mode);
    });

    var clearFun = destDirArr.reduce((pre, cur) => {
      return () => {
        reverse_curry_rimraf(pre)(cur);
      };
    }, done);

    clearFun();
  });
});

gulp.task('clear-dist', (done) => {
  var destDirArr = typeof config.destDir === 'string' ? [config.destDir] : config.destDir;

  var clearFun = destDirArr.reduce((pre, cur) => {
    return () => {
      reverse_curry_rimraf(pre)(cur);
    };
  }, done);

  clearFun();
});