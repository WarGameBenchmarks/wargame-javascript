var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

// personally written javascript
gulp.task('js', function(){
  var files = [
    'resources/js/app.js'
  ];
  return gulp.src(files)
        .pipe(concat('app.js'))
        .pipe(babel())
        .pipe(gulp.dest('resources/build/js/'));
});

// javascript written by third party vendors
gulp.task('js-vendor', function(){
  var files = [];
  return gulp.src(files)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('resources/build/js/'));
});

// basic task: `gulp`
gulp.task('default', ['js']);

// watch task: `gulp watch`
gulp.task('watch', function(){
  gulp.watch('resources/js/*', ['default']);
});
