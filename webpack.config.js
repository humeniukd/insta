import webpack from 'webpack'
export default {
  entry: [
    './client/index.js'
  ],
  output: {
    path: `/`,
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module, count) => {
        return module.resource && module.resource.indexOf('node_modules')
      }
    })
  ],
  module: {
    loaders: [{
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react'],
        plugins: ['transform-runtime', 'transform-object-rest-spread', 'transform-class-properties', 'transform-async-to-generator']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
