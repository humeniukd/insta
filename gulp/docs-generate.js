import fs from 'fs';
import path from 'path';
import help from 'gulp-help';
import swaggerJSDoc from 'swagger-jsdoc';

let gulp = help(require('gulp'));

gulp.task('docs-generate', 'Generate docs for swagger', (callback) => {
    const options = {
        swaggerDefinition: {
            info: {
                title: 'InstantCar',
                version: 'v1',
                description: 'Sample App',
              },
            basePath: '/rest/v1',
            tags: [{
                name: 'Cars',
              }]
          },
        apis: [path.resolve(`${__dirname}/../server/**/*.js`)],
      };

    const spec = swaggerJSDoc(options);

    fs.writeFile(path.resolve(`${__dirname}/../api-docs.json`), JSON.stringify(spec), callback);
  });
