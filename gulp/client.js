import webpack from 'webpack'
import webpackConfig from '../webpack.config'
import gulp from 'gulp'

gulp.task('client', (cb) => {
  webpack(webpackConfig, (err, stats) => {
    stats && console.log(stats.toString())
    err && console.log(err)
    cb()
  })
})
