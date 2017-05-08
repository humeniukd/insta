import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { errorHandler } from './utils'
import oauth from './utils/oauth'
import router from './router'
import config from './config'
import path from 'path'
import compression from 'compression'
import webpackConfig from '../webpack.config'
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

app.use(oauth())

app.use('/api', router)

app.use(errorHandler)

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

    app.use(express.static(path.resolve(`${__dirname}/../node_modules/swagger-ui/dist`)))

    app.get('/swagger', (req, res) => {
      res.sendFile(path.resolve(`${__dirname}/../node_modules/swagger-ui/dist/index.html`))
    })

    app.get('/api-docs.json', (req, res) => {
      res.sendFile(path.resolve(`${__dirname}/../api-docs.json`))
    })

    app.get('*', (req, res) => {
      const memoryFs = compiler.outputFileSystem
      const index = path.join(webpackConfig.output.path, 'index.html')
      const html = memoryFs.readFileSync(index)

      res.end(html)
    })

    break
  default:
    const distPath = path.resolve(`${__dirname}/../public`)
    const indexPath = path.join(distPath, 'index.html')
    app.use(compression())
    app.use(express.static(distPath))

    app.get('*', (req, res) => {
      res.sendfile(indexPath)
    })

    break
}


app.listen(port, () => {
  console.log('About to crank up node')
  console.log(`port=${port}`)
  console.log(`NODE_ENV=${environment}`)
})

export default app
