import gulp from 'gulp'
import webpack from 'webpack'
import config from '../webpack.backend'

gulp.task('build', ['clean', 'client', 'docs'], (cb) => {
  webpack(config, (err, stats) => {
    stats && console.log(stats.toString())
    err && console.log(err)
    cb()
  })
})
