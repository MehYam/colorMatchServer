const gulp = require('gulp');
const source = require('vinyl-source-stream');

const browserify = require('browserify');
const babelify = require('babelify');
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
   b.transform(babelify.configure({presets: 'react'}));

   function makeBundle() {

      const start = Date.now();
      b
      .bundle()
      .on('error', (err) => {
         console.error(err.message);
         console.error(err.codeFrame);
      })
      .on('end', () => { console.log("Bundle completed in", (Date.now() - start), "ms.")})
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('public/'));

      console.log("Bundle building...");
   }

   makeBundle();
   return b;
});

// START clean-up attempt that doesn't work - doesn't catch changes, 'watch2'
const wb = watchify(browserify({
      entries: ['src/app.js'],
      cache: {},
      packageCache: {}
})).transform(babelify.configure({presets: 'react'}));

function bundle() {
   console.log("Bundle building...");
   const start = Date.now();
   return wb
         .bundle()
         .on('update', bundle)
         .on('error', (err) => {
            console.error(err.message);
            console.error(err.codeFrame);
         })
         .on('end', () => { console.log("Bundle completed in", (Date.now() - start), "ms.")})
         .pipe(source('bundle.js'))
         .pipe(gulp.dest('public/'));      
}
gulp.task('watch2', bundle);
// END 'watch2'

gulp.task('default', ['watch']);