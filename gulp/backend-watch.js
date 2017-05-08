import gulp from 'gulp'
import webpack from 'webpack'
import nodemon from 'nodemon'
import config from '../webpack.backend.config'

gulp.task('backend-watch', (done) => {
  let isFiredDone = false

  webpack(config).watch(100, (err, stats) => {
    if (!isFiredDone) {
      isFiredDone = true
      done()
    }
    nodemon.restart()
  })
})
