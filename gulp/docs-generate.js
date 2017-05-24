import fs from 'fs'
import path from 'path'
import gulp from 'gulp'
import swaggerJSDoc from 'swagger-jsdoc'

gulp.task('docs-generate', (callback) => {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'InstaCar',
        version: 'v1',
        description: 'Simple App'
      },
      basePath: '/api',
      tags: [{
        name: 'Cars'
      }]
    },
    apis: [path.resolve(`${__dirname}/../server/**/*.js`)]
  }

  const spec = swaggerJSDoc(options)

  fs.writeFile(path.resolve(`${__dirname}/../api-docs.json`), JSON.stringify(spec), callback)
})
