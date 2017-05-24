import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { errorHandler, cors } from './utils'
import oauth from './utils/oauth'
import router from './router'
import config from './config'
import path from 'path'
import compression from 'compression'
import webpackConfig from '../webpack.dev.config'
import webpack from 'webpack'
import webpackHotMiddelware from 'webpack-hot-middleware'
import webpackDevMiddelware from 'webpack-dev-middleware'

const app = express()
const environment = process.env.NODE_ENV || 'development'
const { port } = config

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(logger('dev'))
app.use(cors)

app.use(errorHandler)

const distPath = path.resolve(`${__dirname}/../../public`)

const indexPath = path.join(distPath, 'index.html')

switch (environment) {
  case 'development':
    webpackConfig.entry = [
      'webpack-hot-middleware/client?reload=true',
      ...webpackConfig.entry
    ]

    const compiler = webpack(webpackConfig)

    app.use(webpackDevMiddelware(compiler, {
      hot: true,
      noInfo: true,
      quiet: true,
      lazy: false,
      watchOptions: { aggregateTimeout: 300 },
      publicPath: webpackConfig.output.publicPath,
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
    app.use(oauth())
    app.use(express.static(distPath))

    app.get('*', (req, res) => {
      res.sendFile(indexPath)
    })

    break
}

app.use('/', router)

app.listen(port, () => {
  console.log('About to crank up node')
  console.log(`port=${port}`)
  console.log(`NODE_ENV=${environment}`)
})

export default app
