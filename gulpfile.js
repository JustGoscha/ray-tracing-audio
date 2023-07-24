var gulp = require('gulp');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var path = require('path');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');

gulp.task('js', function(){
  var b = browserify({
    entries: 'js/main.js', 
    fullPaths: false,
    extensions: ['.js'], 
    debug: true
  });

  return b.transform(babelify)
        .bundle()
        .pipe(source('tracer.js'))
        .pipe(gulp.dest('build'));

  // include main.js first, exclude js/lib
  // gulp.src(['js/**/main.js','js/**/*.js', '!js/lib/*'])   
  // .pipe(babel())
  // .pipe(concat('bundle.js')) 
  // .pipe(gulp.dest('build'));

});

gulp.task('default', gulp.series('js'));
gulp.task('build', gulp.series('js'));
