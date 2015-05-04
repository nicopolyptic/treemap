var gulp = require('gulp'),
    del = require('del'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    pipe = require('multipipe'),
    mirror = require('gulp-mirror'),
    clone = require('gulp-clone'),
    header = require('gulp-header'),
    merge = require('merge2'),
    UglifyJS = require('uglify-js'),
    concat = require('gulp-concat'),
    fs = require('fs');

gulp.task('clean', function(cb) {
    del(['releases'], cb)
});

gulp.task('compile', ['clean'], function() {
    var tsResult = gulp.src('src/main/ts/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: true,
            removeComments: true,
            out: 'treemap-1.0.js',
            target: 'ES5',
            typescript: require('typescript')
        }));
    tsResult.dts.pipe(gulp.dest('releases/definitions'));
    return tsResult.js.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot:'../../src/main/ts'})).pipe(gulp.dest('releases/js'));
});

gulp.task('uglify', ['compile'], function(js){
    var banner = fs.readFileSync('banner.txt', {encoding:'utf8'});
    return gulp.src('releases/js/treemap-1.0.js')
        .pipe(rename({suffix: '.min'}))
        //.pipe(sourcemaps.init())
        .pipe(uglify({inSourceMap: 'releases/js/treemap-1.0.js.map', outSourceMap: "treemap-1.0.min.js.map"}))
        //.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot:'../../src/main/ts'}))
        .pipe(header('/* \n'+ banner + ' \n*/'))
        .pipe(gulp.dest('releases/js'));
});

gulp.task('default', function(){
    gulp.start('uglify');
});
