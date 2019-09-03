var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    del = require('del'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    imagemin = require('gulp-imagemin'),
    prettyHtml = require('gulp-pretty-html'),
    uglify = require('gulp-uglify'),
    glob = require('glob'),
    fs = require('fs');

var paths = {
    dist: 'dist',
    styles: {
        src: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'src/scss/**/*.scss',
        ],
        dest: 'dist/css'
    },
    templates: {
        pages: 'src/pages/**/*.html',
        src: 'src/pages/templates',
        dest: 'dist',
        pattern: 'src/**/*.html'
    },
    images: {
        src: 'src/images/**/*.+(jpg|png|ico)',
        dest: 'dist/images',
        items: 'src/images/items/**/*.jpg'
    },
    scripts: {
        src: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/scrollreveal/dist/scrollreveal.min.js',
            'src/js/script.js'
        ],
        dest: 'dist/js'
    },
    assets: {
        src: 'src/assets/**/*',
        dest: 'dist/assets'
    },
    data: './src/data.json',
};

function assets() {
    return gulp
        .src(paths.assets.src)
        .pipe(gulp.dest(paths.assets.dest))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp
        .src(paths.scripts.src)
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function images() {
    return gulp
        .src(paths.images.src)
        .pipe(imagemin([
            imagemin.jpegtran({
                progressive: true,
            }),
            imagemin.optipng({
                optimizationLevel: 5,
            }),
        ]))
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream());
}

function style() {
    return gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: paths.dist,
            serveStaticOptions: {
                extensions: ['html']
            }
        }
    });
    gulp.watch(paths.assets.src, gulp.series(assets, template));
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.styles.src, style);
    gulp.watch(paths.templates.pattern, template);
}

function clean() {
    return del(paths.dist);
}

function template() {
    return gulp
        .src(paths.templates.pages)
        .pipe(data(function () {
            return JSON.parse(fs.readFileSync('src/assets/data.json'));
        }))
        .pipe(nunjucksRender({
            path: [paths.templates.src],
        }))
        .pipe(prettyHtml())
        .pipe(gulp.dest(paths.templates.dest))
        .pipe(browserSync.stream());
}

const build = gulp.series(
    clean,
    gulp.parallel(
        scripts,
        style,
        images,
        template,
    ),
);

exports.template = template;
exports.style = style;
exports.scripts = scripts;
exports.clean = clean;
exports.watch = gulp.series(
    clean,
    build,
    watch,
);
exports.build = build;