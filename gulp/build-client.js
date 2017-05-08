import help from 'gulp-help';
import webpack from 'webpack';
import gutil from 'gulp-util';
import colorsSupported from 'supports-color';
import webpackConfig from '../webpack.prod.config';
import config from '../gulp/config';

let gulp = help(require('gulp'));

gulp.task('build-client', 'Build client-side scripts',
  ['clean-client', 'ng-config'], (callback) => {

  webpackConfig.entry.app = config.entry;

  webpack(webpackConfig, (err, stats) => {
    if (err)  {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    callback();
  });
});
