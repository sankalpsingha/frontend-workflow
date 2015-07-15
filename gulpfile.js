/*
 This is the workflow file for Quadtrust using Gulp.
 */

var gulp = require('gulp'),
    jade = require('gulp-jade'),
    coffee = require('gulp-coffee'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cache = require('gulp-cache'),
    connect = require('gulp-connect'),
    bower = require('gulp-bower'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');


var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('jade', function () {
    return gulp.src('src/templates/**/*.jade')
        .pipe(jade({
            pretty: true  // uncompressed
        }))
        .pipe(gulp.dest('builds/development'))
        .pipe(connect.reload());
});

gulp.task('coffee', function () {
    return gulp.src('src/js/**/*.coffee')
        .pipe(sourcemaps.init())
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('builds/development/js/'))
        .pipe(connect.reload());
});

gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('src/templates/**/*.jade', ['jade']);
    gulp.watch('src/js/**/*.coffee', ['coffee']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/images/*',['images'])
});

gulp.task('connect', function () {
    connect.server({
        root: 'builds/development',
        livereload: true,
    })
});

gulp.task('images', function () {
    return gulp.src('src/images/*')
        .pipe(
        cache(imagemin({
            optimizationLevel: 3,
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('builds/development/images/'))
        .pipe(connect.reload());
});

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('builds/development/libs'));
});

gulp.task('default', ['coffee', 'sass', 'jade', 'watch', 'connect', 'images']);
