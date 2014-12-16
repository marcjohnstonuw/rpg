//Core
var	gulp = require('gulp');

//Util
var del = require('del');
var path = require('path');

//Compile
var	less = require('gulp-less');
var imagemin = require('gulp-imagemin');

//Watch
var	changed = require('gulp-changed');
var	watch = require('gulp-watch');

//Server
var	connect = require('gulp-connect');

//Variables
var paths = {
	scripts:    'js/**/*.js',
	less:       {
		root: 'less',
		all:  'less/**/*.less',
		main: 'less/main.less'
	},
	dist:       'dist',
	images:     'images/**/*',
	html:       './*.html',
};

gulp.task('clean', function(cb) {
	del(paths.dist + '/**/*', cb);
});

// Less tasks
gulp.task('less', function () {
	return gulp.src(paths.less.main)
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.on('error', function (error) {
			console.log(error.toString());
			this.emit('end');
		})
		.pipe(gulp.dest(paths.dist + '/css'))
});

// Javascript copy tasks
gulp.task('javascript', function () {
	return gulp.src(paths.scripts)
		.pipe(changed(paths.dist + '/js'))
		.pipe(gulp.dest(paths.dist + '/js'))
		.on('error', function (error) {
			console.log(error.toString());
			this.emit('end');
		});
});

// Image minification task
gulp.task('images', function () {
	return gulp.src(paths.images)
		.pipe(imagemin({ optimizationLevel: 5}))
		.pipe(gulp.dest(paths.dist + '/images'));
});

// HTML tasks
gulp.task('html', function () {
	return gulp.src(paths.html)
		.pipe(changed(paths.dist))
		.pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function () {
	gulp.watch(paths.less.all, ['less']);
	gulp.watch(paths.html, ['html']);
	gulp.watch(paths.scripts, ['javascript']);
	watch(paths.dist + '/**/*').pipe(connect.reload());
});

// Launch Server
gulp.task('connect', function () {
	connect.server({
		port: 5678,
		root: 'dist',
		livereload: true
	});
});







gulp.task('build', ['less', 'javascript', 'images', 'html'], function () {
	console.log("Starting Server and Watch Server...");
	gulp.start('connect', 'watch');
});

gulp.task('default', ['clean'], function () {
	gulp.start('build');
});