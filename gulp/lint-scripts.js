import help from 'gulp-help';
import jshint from 'gulp-jshint';
import jscs from 'gulp-jscs';
import config from './config';

let gulp = help(require('gulp'));

gulp.task('lint-scripts', 'Lint scripts and try to fix any code style errors', () => {
  return gulp
    .src(config.lint)
    .pipe(jshint())
    .pipe(jshint.reporter('fail'))
    .pipe(jscs({fix: true}))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(gulp.dest((file) => {
      return file.base;
    }));
});
