const gulp = require('gulp')
const mocha = require('gulp-mocha')
const runSequence = require('run-sequence')

const config = {
	src: './src/**/*.js',
	test: './src/test/**/*.spec.js',
}

gulp.task('test-watch', () => {
	runSequence(
		'test',
		() => { gulp.watch([config.src, config.test], ['test']) }
	)
})

gulp.task('test', () => {
	gulp.src(config.test, { read: false })
		.pipe(mocha({ reporter: 'spec' }))
		.on('error', err => console.log(err.toString()))
})
