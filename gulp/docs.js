import fs from 'fs'
import path from 'path'
import gulp from 'gulp'
import swaggerJSDoc from 'swagger-jsdoc'
import webpackConfig from '../webpack.config'

gulp.task('docs', (callback) => {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'Cars App',
        version: 'v1',
        description: 'You can use the api key `swagger` to pass the authorization.'
      },
      basePath: '/api',
      tags: [{
        name: 'Cars'
      }]
    },
    apis: [path.resolve(`${__dirname}/../server/**/*.js`)]
  }

  const spec = swaggerJSDoc(options)

  fs.writeFile(path.resolve(`${webpackConfig.output.path}/api-docs.json`), JSON.stringify(spec), callback)
  console.log('To explore api visit http://petstore.swagger.io/?url=[yoursiteurl]/api-docs.json')
})
