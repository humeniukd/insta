import gulp from 'gulp'
import nodemon from 'nodemon'
import path from 'path'

gulp.task('serve', ['backend-watch'], () => {
  return nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, '../build/backend'),
    ignore: ['*'],
    watch: ['nonexistent/'],
    ext: 'nonexistent'
  }).on('restart', () => {
    console.log('Patched!')
  })
})
