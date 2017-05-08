import path from 'path'
import nodeExternals from 'webpack-node-externals'

export default {
  entry: './server/app.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'es2017'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  node: {
    __dirname: true,
    __filename: true
  },
  devtool: 'sourcemap'
}
