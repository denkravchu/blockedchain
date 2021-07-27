const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const del = require('del');
const argv = require('yargs').argv;
const browserSync = require('browser-sync');
const gulpWatch = require('gulp-watch');
const image = require('gulp-image');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('gulp-cssnano');
const shorthand = require('gulp-shorthand');
const uncss = require('gulp-uncss');
const gcmq = require('gulp-group-css-media-queries');
const webpack = require('webpack-stream');





const paths = {

  root: './dist',

  html: {
    src:'./src/*.html',
    dest: './dist/'
  },

  styles: {
    main: './src/scss/main.scss',
    dest: './dist/css'
  },

  scripts: {
    main: './src/js/main.js',
    dest: './dist/js'
  },

  images: {
    src: './src/img/**',
    dest: './dist/img'
  },

  videos: {
      src: './src/video/**',
      dest: './dist/video'
  },

  fonts: {
    src: './src/fonts/**',
    dest: './dist/fonts'
  },

  delete: {
    dest: './dist/*'
  }

}

let isDev = false;
let lan = false;
if (argv.dev) isDev = true;
if (argv.lan) lan = true;

let webConfig = {
    output: {
      filename: 'main.js'
    },
    module: {
      rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
    },
    mode: isDev ? 'development' : 'production',
    // devtool: isDev ? 'eval-source-map' : 'none'
};


function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function styles() {
  return gulp.src(paths.styles.main)
    .pipe(gulpif(argv.dev, sourcemaps.init()))
    .pipe(sass({
       includePaths: require('node-normalize-scss').includePaths
    }).on('error', sass.logError))
    // .pipe(gulpif(!argv.dev,uncss({ // Удаляет неиспользуемые стили в режиме production
    //         html: ['./src/index.html', './src/pages/**/*.html']
    //       })))
    .pipe(shorthand())
    .pipe(gcmq())
    .pipe(autoprefixer({
            cascade: false
        }))
    .pipe(gulpif(!argv.dev,cssnano()))
    .pipe(gulpif(argv.dev,sourcemaps.write('.')))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.scripts.main)
    .pipe(webpack(webConfig))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src(paths.images.src)
    .pipe(gulpif(!argv.dev,image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      guetzli: false,
      gifsicle: true,
      svgo: false,
      concurrent: 10,
      quiet: true // defaults to false
    })))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

function videos() {
    return gulp.src(paths.videos.src)
        .pipe(gulp.dest(paths.videos.dest))
        .pipe(browserSync.stream());
}

function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.stream());
}

function clean() {
  return del([paths.delete.dest]);
}

function _watch() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    tunnel: lan
  });

  gulp.watch('./src/**/*.html', html); //
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/scss/**/*.scss', styles);
  gulp.watch('./src/images/**', images);
  gulp.watch('./src/fonts/**', fonts);
  gulp.watch('./src/vieos/**', videos);
  gulp.watch('./dist/**/*.html', browserSync.reload);

}

/*Инициализация тасков(команд) в отдельности*/
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.fonts = fonts;
exports.videos = videos;
exports.clean = clean;
exports._watch = _watch;


gulp.task("build", gulp.series(clean, html, gulp.parallel(styles, scripts, images, videos, fonts))); // Таск вызывающий последоваетльно мелкие таски, а затем параллельно
gulp.task("watch", gulp.series(clean, html, gulp.parallel(styles, scripts, images, videos, fonts), _watch)); // Таск вызывающий последоваетльно мелкие таски, а затем параллельно + watch
