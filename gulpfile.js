var gulp=require('gulp');
//引入组件
var minifycss=require('gulp-minify-css'),  // css压缩
    uglify=require('gulp-uglify'),    //js压缩
    concat=require('gulp-concat'),      //合并文件
    rename=require('gulp-rename'),      //重命名
    clean=require('gulp-clean'),        //清空文件夹
    minhtml=require('gulp-htmlmin'),    //html压缩
    jshint=require('gulp-jshint'),      //js代码规范性检查
    imagemin=require('gulp-imagemin');  //图片压缩
    autoprefix = require('gulp-autoprefixer'),  //CSS浏览器兼容前缀自动补充
    less = require('gulp-less'),   //CSS预处理语言的
    browserSync = require('browser-sync'),     //构建本地服务器并带有刷新功能
    runSequence = require('run-sequence'),     //任务能够按照顺序执行
    del = require('del');     //删除文件

    gulp.task('jshint', function() {
         gulp.src('./js/*.js')
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
     });
    gulp.task('scripts', function(callback) {
        // 这里可以引入其他js库
        gulp.src(['./js/common.js'])
            .pipe(concat('all.js'))
            .pipe(gulp.dest('./dist/js/'))
            .pipe(rename('all.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./dist/js/'))
            .pipe(browserSync.reload({
            stream: true
        }));
        callback();
     });
    gulp.task('less', function(callback) {
        // 其余的样式文件都由style.less引入
        gulp.src(['./css/style.less'])
            .pipe(less())
            .pipe(autoprefix({
                   browsers: ['last 2 versions'],
                }))
           .pipe(rename('all.css'))
           .pipe(gulp.dest('./dist/css/'))
           .pipe(rename('all.min.css'))
           .pipe(cleanCSS())
           .pipe(gulp.dest('./dist/css/'))
           .pipe(browserSync.reload({
           stream: true
    }));
        callback();
    });
    gulp.task('browserSync', function() {
        browserSync({
               server: {
                   baseDir: './'
                }
         })
    });
    gulp.task('watch', function() {
     gulp.watch('./js/*.js', function() {
             runSequence('jshint', 'scripts');
        });
     gulp.watch('./css/*.less', ['less']);
     gulp.watch('./*.html', browserSync.reload);
   });
    gulp.task('clean', function(callback) {
       del(['dist/css/', 'dist/js/']);
         callback();
    });
    gulp.task('build', ['clean'], function(callback) {
        runSequence(['less', 'scripts']);
   });
    gulp.task('default', function(callback) {
        runSequence('jshint', ['less', 'scripts', 'browserSync', 'watch'], callback);
    });
