process.env.NODE_ENV = '"release"';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    gulpSequence = require('gulp-sequence'),
    miniPackageJson = require('./scripts/gulp-mini-package-json');

function printError(e) {
    console.error(e.toString());
}

/**
 * move font
 */
gulp.task('font', function () {
    return gulp.src('./src/lib/assets/fonts/**')
        .on('error', printError)
        .pipe(gulp.dest('./dist/lib/assets/fonts'));
});

/**
 * sass compile
 */
gulp.task('sass', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sass())
        .on('error', printError)
        .pipe(gulp.dest('./dist'));
});

/**
 * es compile
 */
gulp.task('es', function () {
    return gulp.src('./src/**/*.js')
        .pipe(babel({
            plugins: ['transform-runtime']
        }))
        .on('error', printError)
        .pipe(gulp.dest('./dist'));
});

/**
 * copy extra files to dist
 */
gulp.task('copyNpmFiles', function () {
    return gulp.src(['README.md', './LICENSE'])
        .pipe(gulp.dest('./dist'));
});
gulp.task('copyPackageJson', function () {
    return gulp.src('./package.json')
        .pipe(miniPackageJson())
        .pipe(gulp.dest('./dist'));
});
gulp.task('copyFiles', gulpSequence('copyNpmFiles', 'copyPackageJson'));

/**
 * build components for npm publish
 */
gulp.task('build', gulpSequence('sass', 'es', 'font', 'copyFiles'));

/**
 * watch components src files
 */
gulp.task('watch', function () {
    gulp.watch('./src/**/*.scss', ['sass']);
    gulp.watch('./src/**/*.js', ['es']);
});