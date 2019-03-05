var gulp = require('gulp');
var folder = {
    src: 'src/',
    dist: 'dist/'
}
var htmlclean = require('gulp-htmlclean');  //压缩html
var imagemin = require('gulp-imagemin');    //压缩图片
var uglify = require('gulp-uglify');        //压缩js
var stripdebug = require('gulp-strip-debug'); //去掉调试语句
var less = require('gulp-less'); //将less转化为css
var cleancss = require('gulp-clean-css');   //压缩css
var postcss = require('gulp-postcss');  //解析css
var autoprefixer = require('autoprefixer'); //添加css前缀
var connect = require('gulp-connect');  //开启服务器

var mode = process.env.NODE_ENV == 'development';  //判断当前环境变量 true or false 
//设置环境变量，命令行输入 export NODE_ENV=development



gulp.task('html', function () {
    var page = gulp.src(folder.src + 'html/*')
                   .pipe(connect.reload())
    if (!mode) {
        page.pipe(htmlclean())
    }
    page.pipe(gulp.dest(folder.dist + 'html/'))
})

gulp.task('css', function () {
    var page = gulp.src(folder.src + 'css/*')
                   .pipe(connect.reload())
                   .pipe(less())
                   .pipe(postcss([autoprefixer()]))
    if (!mode) {
        page.pipe(cleancss())
    }
    page.pipe(gulp.dest(folder.dist + 'css/'))
})

gulp.task('img', function () {
    gulp.src(folder.src + 'img/*')
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + 'img/'))
})

gulp.task('js', function () {
    var page = gulp.src(folder.src + 'js/*')
                   .pipe(connect.reload())
    if (!mode) {
        page.pipe(stripdebug())
            .pipe(uglify())
    }
    page.pipe(gulp.dest(folder.dist + 'js/'))
})

gulp.task('server', function () {
     connect.server({
         port: '8080',
         livereload: true
     })
})

gulp.task('watch', function () {
    gulp.watch(folder.src + 'html/*').on('change', gulp.series('html'));
    gulp.watch(folder.src + 'css/*').on('change', gulp.series('css'));
    gulp.watch(folder.src + 'js/*').on('change', gulp.series('js'));
})

gulp.task('default', gulp.parallel(['html', 'css', 'js', 'img', 'server', 'watch']))