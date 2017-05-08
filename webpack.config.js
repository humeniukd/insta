export default {
  entry: [
    './client/src/index.js'
  ],
  output: {
    path: `/`,
    publicPath: '/',
    filename: 'app.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['env']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
