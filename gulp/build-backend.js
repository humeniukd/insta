import gulp from 'gulp'
import webpack from 'webpack'
import config from '../webpack.backend.config'

gulp.task('build-backend', (done) => {
  webpack(config).run(onBuild(done))
})

function onBuild (done) {
  return function (err, stats) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log(stats.toString())
    }

    if (done) {
      done()
    }
  }
}
