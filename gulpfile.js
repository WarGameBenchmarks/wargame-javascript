var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

// personally written javascript
gulp.task('js', function(){
  var files = [
    'resources/js/profiler.js',
    'resources/js/app.js'
  ];
  return gulp.src(files)
        .pipe(concat('app.js'))
        .pipe(babel())
        .pipe(gulp.dest('resources/build/js/'));
});

// special files for wargame.js contents
gulp.task('js-wargame', function(){
  var files = ['resources/js/wargame.js'];
  return gulp.src(files)
        .pipe(concat('wargame.js'))
        .pipe(babel())
        .pipe(gulp.dest('resources/build/js/'));
});

// javascript written by third party vendors
gulp.task('js-vendor', function(){
  var files = ['resources/js/jquery-2.1.4.js'];
  return gulp.src(files)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('resources/build/js/'));
});

// basic task: `gulp`
gulp.task('default', ['js', 'js-wargame', 'js-vendor']);

// watch task: `gulp watch`
gulp.task('watch', function(){
  gulp.watch('resources/js/*', ['default']);
});
