import webpack from 'webpack'
export default {
  entry: [
    '../client/src/index.js'
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
        presets: ['es2015', 'es2017', 'react'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
