import gulp from 'gulp'
import del from 'del'
import config from '../webpack.config'
import backendConfig from '../webpack.backend'

gulp.task('clean', (cb) => {
  del([`${config.output.path}/*.js`, `${backendConfig.output.path}/*.js`]).then((paths) => {
    console.log('[clean]', paths)
    cb()
  })
})
