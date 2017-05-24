import fs from 'fs'
import path from 'path'

export default {
  entry: './server/app.js',
  target: 'node',
  externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).reduce((ext, mod) => {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {}),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-runtime', 'transform-async-to-generator', 'transform-object-rest-spread', 'transform-class-properties']
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
