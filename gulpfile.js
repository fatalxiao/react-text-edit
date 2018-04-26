const gulp = require('gulp'),
    babel = require('gulp-babel'),
    gulpSequence = require('gulp-sequence'),
    miniPackageJson = require('./scripts/gulp-mini-package-json');

gulp.task('copyES', () => gulp.src('./src/**/*.js')
    .pipe(babel({plugins: ['transform-runtime']})).pipe(gulp.dest('./dist'))
);

/**
 * copy extra files to dist
 */
gulp.task('copyNpmFiles', () => gulp.src(['README.md', './LICENSE']).pipe(gulp.dest('./dist')));
gulp.task('copyPackageJson', () => gulp.src('./package.json').pipe(miniPackageJson()).pipe(gulp.dest('./dist')));
gulp.task('copyFiles', gulpSequence('copyNpmFiles', 'copyPackageJson'));

/**
 * build components for npm publish
 */
gulp.task('copy', gulpSequence('copyES', 'copyFiles'));