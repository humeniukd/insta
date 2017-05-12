import webpack from 'webpack'
import config from './webpack.config'

config.devtool = 'eval'

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
])

export default config
