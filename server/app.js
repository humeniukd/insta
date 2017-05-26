import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler } from './utils'
import oauth from './utils/oauth'
import router from './router'
import config from './config'
import compression from 'compression'
import webpackDevConfig from '../webpack.development'
import webpackConfig from '../webpack.config'
import webpack from 'webpack'
import webpackHotMiddelware from 'webpack-hot-middleware'
import webpackDevMiddelware from 'webpack-dev-middleware'

const app = express()
const environment = process.env.NODE_ENV || 'development'
const { port } = config

app.use(bodyParser.json())
app.use(cookieParser())
app.use(logger(environment))
app.use(cors())

app.use(errorHandler)
app.use(oauth())

switch (environment) {
  case 'development':
    webpackDevConfig.entry = [
      'webpack-hot-middleware/client?reload=true',
      ...webpackDevConfig.entry
    ]

    const compiler = webpack(webpackDevConfig)

    app.use(webpackDevMiddelware(compiler, {
      hot: true,
      noInfo: true,
      quiet: true,
      lazy: false,
      watchOptions: { aggregateTimeout: 300 },
      publicPath: webpackDevConfig.output.publicPath,
      stats: {
        colors: true,
        chunks: false,
        modules: false
      }
    }))

    app.use(webpackHotMiddelware(compiler))

    break
  default:
    app.use(compression())
    app.use(express.static(webpackConfig.output.path))
    break
}

app.use('/', router)

app.listen(port, () => {
  console.log('About to crank up node')
  console.log(`port=${port}`)
  console.log(`NODE_ENV=${environment}`)
})

export default app
