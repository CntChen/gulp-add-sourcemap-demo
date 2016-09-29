var gulp = require('gulp');
var webpack = require('webpack');

var config = require('../config');
var makeWebpackConfig = require('../make-webpack.config');

config.modeArr.forEach((mode) => {
  gulp.task(mode + ':' + 'webpack', (done) => {
    var self = this;
    webpack(makeWebpackConfig({
      mode: mode,
    }), (err, stats) => {
      if (err) {
        console.log(err);
        self.emit('end');
      }
      done();
    });
  });
})