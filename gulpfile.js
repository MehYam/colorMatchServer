const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const watchify = require('watchify');

gulp.task('bundle', () => {
   return browserify('src/app.js')
      .transform('babelify', {presets: 'react'})
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('public/'));
});

gulp.task('watch', () => {

   const b = browserify({
      entries: ['src/app.js'],
      cache: {},
      packageCache: {},
      plugin: ['watchify']
   });

   b.on('update', makeBundle);

   function makeBundle() {
      b.transform('babelify', {presets: 'react'})
         .bundle()
         .on('error', (err) => {
            console.error(err.message);
            console.error(err.codeFrame);
         })
         .pipe(source('bundle.js'))
         .pipe(gulp.dest('public/'));

      console.log("Bundle updated");
   }

   makeBundle();
   return b;
});

gulp.task('default', ['watch']);