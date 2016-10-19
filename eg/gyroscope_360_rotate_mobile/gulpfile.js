// 引入 gulp
var gulp = require('gulp'),
	connect = require('gulp-connect');

//配置本地环境
gulp.task('server', function() {
	connect.server({
		livereload: true,
		port: 1010
	});
});
gulp.task("default", ["server"])