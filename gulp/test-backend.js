import gulp from 'gulp';
import mocha from 'gulp-mocha';

const TEST_FILES = [
  './server/**/*.spec.js'
];

const SRC_FILES = [
  './common/**/*.js',
  '!./common/**/*.spec.js',
];

gulp.task('test-backend', () => {
  return gulp.src(TEST_FILES)
    .pipe(mocha());
});
