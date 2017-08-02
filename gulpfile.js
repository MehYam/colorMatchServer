const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

gulp.task('bundle', () => {
   return browserify('src/app.js')
      .transform('babelify', {presets: 'react'})
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('public/'));
});