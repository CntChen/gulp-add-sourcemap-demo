var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var config = require('../config');

gulp.task('uglify', (done) => {
  gulp.src(config.uglifySrc)
    // .pipe(sourcemaps.init({
    //   loadMaps: true,
    // }))
    .pipe(uglify().on('error', function(e) {
      console.error(e);
    }))
    // .pipe(sourcemaps.write('./', {
    //   includeContent: true,
    // }))
    .pipe(gulp.dest(config.uglifyDest+'/a/'));

  done();
});