var gulp = require('gulp'),
	rename = require('gulp-rename'),
	browserify = require('gulp-browserify'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

gulp.task('build', function () {

	gulp.src('component.js')
		.pipe(browserify())
		.pipe(rename('live-list.js'))
		.pipe(gulp.dest('./'))
		.pipe(reload({stream:true}));
});

gulp.task('watch', function () {
	gulp.watch(['*.js', '!live-list.js'], ['build']);
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['build', 'browser-sync', 'watch']);