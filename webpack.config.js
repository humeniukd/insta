import webpack from 'webpack'
export default {
  entry: [
    './client/index.js'
  ],
  output: {
    path: `public/`,
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module, count) => {
        return module.resource && module.resource.indexOf('node_modules')
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
      compress: {
        warnings: false
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
