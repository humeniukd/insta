import help from 'gulp-help';
import os from 'os';
import path from 'path';
import {protractor} from 'gulp-protractor';

let gulp = help(require('gulp'));

gulp.task('test-e2e', 'Build and run E2E tests',
  ['ng-config', 'build-backend', 'build-client'], () => {
    const server = require('../server/app');

    gulp.src(['../e2e/*.spec.js'])
      .pipe(protractor({ configFile: './protractor.conf.js' }))
      .on('error', (e) => {
        throw e;
      })
      .on('end', process.exit);
  });

gulp.task('test-e2e-nobuild', 'Run E2E tests', () => {
  const server = require('../server/app');

  gulp.src(['../e2e/*.spec.js'])
    .pipe(protractor({configFile: './protractor.conf.js'}))
    .on('error', (e) => {
      throw e;
    })
    .on('end', process.exit);
});
