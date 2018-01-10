'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    rimraf = require('rimraf'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    svgmin = require('gulp-svgmin'),
    concat = require('gulp-concat');




var path = {
    build: { 
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        svg: 'build/svg/icons',
        maps: 'build/svg/maps'
    },
    src: { 
        html: 'src/*.html', 
        js: 'src/js/*.js',
        style: 'src/scss/*.scss',
        img: 'src/img/**/*.*', 
        fonts: 'src/fonts/**/*.*',
        svg: 'src/svg/icons/*.*',
        maps: 'src/svg/maps/*.*'
    },
    watch: { 
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        svg: 'src/svg/icons/*.svg',
        maps: 'src/svg/maps/*.svg'
    },
    clean: './build'
};


var JsPath = 'node_modules/';


gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(gulp.dest(path.build.html)) 
});


gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(rigger()) 
        .pipe(sourcemaps.init()) 
        .pipe(uglify()) 
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js)) 
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
        .pipe(sourcemaps.init()) 
        .pipe(sass()) 
        .pipe(prefixer()) 
        .pipe(cssmin()) 
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css)) 
});

// gulp.task('css:build', function(){
//     gulp.src(path.src.style)
//         .pipe(cssmin())
//         .pipe(rename({suffix: '.min'}))
//         .pipe(gulp.dest(path.build.css));
// });


gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)); 
});

gulp.task('icons:build', function () {
    return gulp.src(path.src.svg)
        .pipe(svgmin())
        .pipe(gulp.dest(path.build.svg));
});

gulp.task('maps:build', function(){
    gulp.src(path.src.maps)
        .pipe(gulp.dest(path.build.maps))

});


gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);



// gulp.task('libs-js', function () {  
//     return gulp.src(['src/libs/libs.js', 'src/libs/slick/slick.js', 'src/libs/scroll/scroll.js', 'node_modules/ckeditor/ckeditor.js'])
//         .pipe(concat('libs1.js'))
//         .pipe(uglify()) 
//         .pipe(gulp.dest('build/libs/'));
// });

gulp.task('libs-js', function () {  
    return gulp.src([ JsPath + 'jquery/dist/jquery.js', JsPath + 'jquery-ui-dist/jquery-ui.min.js', JsPath + '@claviska/jquery-minicolors/jquery.minicolors.js',   JsPath + 'materialize-css/dist/js/materialize.min.js', JsPath + "slick-carousel/slick/slick.js" ,JsPath + "snapsvg/dist/snap.svg-min.js"])
        .pipe(concat('libs.js'))
        .pipe(uglify()) 
        .pipe(gulp.dest('build/libs/'));
});

gulp.task('libs-css', function () { 
    return gulp.src(['node_modules/materialize-css/dist/css/materialize.min.css','node_modules/jquery-ui-dist/jquery-ui.css' ,'node_modules/@claviska/jquery-minicolors/jquery.minicolors.css', "node_modules/slick-carousel/slick/slick.css"])
        .pipe(concat('libs.css'))
        .pipe(prefixer()) 
        .pipe(cssmin()) 
        .pipe(gulp.dest('build/libs/'));
});




gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'watch']);