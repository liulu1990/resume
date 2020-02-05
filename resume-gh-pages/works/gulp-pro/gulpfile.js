var gulp = require('gulp'); 
	// 引入组件 
	var minifycss = require('gulp-minify-css'), // CSS压缩 
		uglify = require('gulp-uglify'), // js压缩 
		concat = require('gulp-concat'), // 合并文件 
		rename = require('gulp-rename'), // 重命名 
		clean = require('gulp-clean'), //清空文件夹 
		minhtml = require('gulp-htmlmin'), //html压缩 
		jshint = require('gulp-jshint'), //js代码规范性检查 
		imagemin = require('gulp-imagemin'), //图片压缩
		browserSync = require ( 'browser-sync' ).create ( '===' ),//构建本地服务器并带有刷新功能
		del = require ( 'del' );//删除文件
	var gulpSequence = require ( 'gulp-sequence' );//同步任务
 gulp.task('html', function() {
		gulp.src('./*.html')
		.pipe(minhtml({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
	    .pipe ( browserSync.reload ( {
		 stream : true
	 }));
 });
 gulp.task('css', function() {
	 gulp.src ( './css/**/*.css' )
 		.pipe(concat('merge.min.css')) 
 		.pipe(minifycss()) 
 		.pipe(gulp.dest('dist/css/'))
		 .pipe ( browserSync.reload ( {
			 stream : true
		 }));
 }); 
 gulp.task('js', function() {
	gulp.src ( './js/**/*.js' )
 		.pipe(jshint()) 
 		.pipe(jshint.reporter('default')) 
 		.pipe(concat('merge.min.js')) 
 		.pipe(uglify()) 
 		.pipe(gulp.dest('dist/js/'))
		.pipe ( browserSync.reload ( {
			stream : true
		}));
 }); 
 gulp.task('img', function(){
	 gulp.src ( './img/**/*.{png,jpg,gif,ico}' )
        .pipe(imagemin()) 
         .pipe(gulp.dest('dist/img')); 
 });
 gulp.task ( 'watch' , function () {
	gulp.watch ( './css/**/*.css' , ['css'] );
	gulp.watch ( './index.html' , ['html'] );
	gulp.watch ( './img/**/*.{png,jpg,gif,ico}' , ['img'] );
	gulp.watch ( './js/**/*.js' , ['js'] );
 });
 gulp.task ( 'dev:server' , function () {
	 browserSync.init ( {
		startPath : '/' ,
		server    : {
			baseDir : "./dist/"
		} ,
		 port : 5000
	});

 });
 gulp.task ( 'clean' , function ( cb ) {
	return del ( ['./dist'] , cb );
 });
 gulp.task ( 'default' , gulpSequence ( 'clean' , ['html'] , ['css' , 'js' , 'img'] , 'watch','dev:server' ) );
