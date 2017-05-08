import help from 'gulp-help';
import {argv as args} from 'yargs';
import path from 'path';
import config from './config';

let gulp = help(require('gulp'));

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
  var child;
  var excludeFiles = [];
  var fork = require('child_process').fork;
  var Karma = require('karma').Server;
  var serverSpecs = config.serverIntegrationSpecs;

  if (args.startServers) {
    console.log('Starting servers');
    var savedEnv = process.env;
    savedEnv.NODE_ENV = 'development';
    savedEnv.PORT = 8888;
    child = fork(path.join(__dirname, '../build/backend'));
  } else {
    if (serverSpecs && serverSpecs.length) {
      excludeFiles = serverSpecs;
    }
  }
  new Karma({
    configFile: path.resolve(config.karma.configFile),
    exclude: excludeFiles,
    singleRun: !!singleRun
  }, onComplete).start();

  ////////////////

  function onComplete(result) {
    console.log('Karma completed');
    if (child) {
      console.log('shutting down the child process');
      child.kill();
    }
    if (result === 1) {
      done(`karma: tests failed with code ${result}`);
    } else {
      done();
    }
  }
}

gulp.task('test-unit', 'Run unit tests for client-side and backend parts',
  ['ng-config'], (done) => {
    startTests(true /*singleRun*/, done);
  });
