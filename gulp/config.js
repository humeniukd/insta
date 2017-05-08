import path from 'path';

const root = '..';
const client = `${root}/client`;
const report = `${root}/reports`;

let resolveToApp = (glob = '') => path.join(__dirname, client, 'app', glob);
let resolveToComponents = (glob = '') => path.join(__dirname, client, 'app/components', glob);

export default {
  js: resolveToComponents('**/*!(.spec.js).js'),
  less: resolveToApp('**/*.less'),
  karma: {
    configFile: 'karma.conf.babel.js',
    exclude: [],
    coverage: {
      dir: `${report}/coverage`,
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcov', subdir: 'lcov' },
        { type: 'text-summary' }
      ]
    },
    jenkins: {
      outputFile: `${report}/jenkins/test-results.xml`
    },
    preprocessors: {
      [`${client}/app/**/!(*.spec)+(.js)`]: ['coverage'],
    }
  },
  html: [
    resolveToApp('**/*.html'),
    path.join(client, 'index.html')
  ],
  entry: [
    'babel-polyfill',
    path.join(__dirname, client, 'app/app.js')
  ],
  output: client,
  dest: path.join(__dirname, 'dist'),
  dist: {
    client: path.join(__dirname, root, 'dist'),
    backend: path.join(__dirname, root, 'build')
  },
  lint: [
    './client/**/*.js',
    './e2e/**/*.js',
    './server/**/*.js',
    './gulp/**/*.js',
    './gulpfile*.js',
    './webpack*.js',
    './protractor*.js',
    './karma*.js',
    './spec*.js'
  ]
};
