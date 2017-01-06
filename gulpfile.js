'use strict';

var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var densityUi = require('density-ui');

var gulp = require('gulp');
var gulpIf = require('gulp-if');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nunjucks = require('gulp-nunjucks');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');
var hash = require('gulp-hash');
var del = require('del');

var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Normalize environment name
const ENVIRONMENT_NAME = process.env.NODE_ENV || 'development';

// cache busting
const CACHE_BUST_ENABLED = ENVIRONMENT_NAME !== 'development';
const hashOptions = {
  algorithm: 'sha256',
  hashLength: 8,
  template: '<%= name %>-rev.<%= hash %><%= ext %>'
};

// Boolean flags passed to templates
const LIVERELOAD_ENABLED = ENVIRONMENT_NAME === 'development';
const ANALYTICS_ENABLED = ENVIRONMENT_NAME !== 'development';
const REPORTING_ENABLED = ENVIRONMENT_NAME !== 'development';

// Other options based on environment
const WATCHIFY_ENABLED = ENVIRONMENT_NAME === 'development';
const BROWSERIFY_DEBUG_ENABLED = ENVIRONMENT_NAME === 'development';
const SASS_OUTPUT_STYLE = ENVIRONMENT_NAME === 'development' ? 'nested' : 'compressed';

console.log(`environment is ${ENVIRONMENT_NAME}`);

const BUILD_PATH = './build';
const ASSETS_PATH = `${BUILD_PATH}/assets`;

const ASSETS_URL = process.env.ASSETS_URL || '/assets';

var browserifyOptions = Object.assign({}, watchify.args, {
  entries: ['./src/scripts/main.js'],
  paths: ['./node_modules', './src/scripts'],
  debug: BROWSERIFY_DEBUG_ENABLED,
  poll: true
});
var b = browserify(browserifyOptions);
if (WATCHIFY_ENABLED) {
  b = watchify(b);
}
// add transformations here
b.transform(babelify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('application.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    .pipe(gulpIf(CACHE_BUST_ENABLED, hash(hashOptions)))
    .pipe(gulp.dest(ASSETS_PATH))
    .pipe(gulpIf(LIVERELOAD_ENABLED, livereload()))
}

gulp.task('init-livereload', () => {
  livereload.listen(35729, (err) => {
    if (err) return console.error(err);
  });
});

gulp.task('clean', (cb) => {
  del(['build']).then(() => cb())
})

gulp.task('views', () => {

  const resolveAsset = require('./helpers/resolve-asset');

  return gulp.src(['src/views/*.html'])
    .pipe(nunjucks.compile({
      ENVIRONMENT_NAME,
      ASSETS_URL,
      LIVERELOAD_ENABLED,
      REPORTING_ENABLED,
      ANALYTICS_ENABLED,
      resolveAsset
    }))
    .pipe(gulp.dest(BUILD_PATH))
    .pipe(gulpIf(LIVERELOAD_ENABLED, livereload()));
});

// Images
gulp.task('images', () => {
  return gulp.src(['src/assets/images/**/*'])
    .pipe(gulp.dest('build/assets/images'));
});

// videos
gulp.task('videos', () => {
  return gulp.src(['src/assets/videos/**/*'])
    .pipe(gulp.dest('build/assets/videos'));
});

// Fonts
gulp.task('fonts', () => {
  return gulp.src(['src/assets/fonts/**/*'])
    .pipe(gulp.dest('build/assets/fonts'));
});

// Icons
gulp.task('icons', () => {
  return gulp.src(['src/assets/icons/**/*'])
    .pipe(gulp.dest('build/assets/icons'));
});

gulp.task('assets', (cb) => {
  runSequence(['images', 'videos', 'fonts', 'icons'], cb)
})

gulp.task('css', () => {
  return gulp.src('src/styles/application.scss')
    .pipe(sass({
      outputStyle: SASS_OUTPUT_STYLE,
      includePaths: densityUi.includePaths
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 1 version'))
    .pipe(gulpIf(CACHE_BUST_ENABLED, hash(hashOptions)))
    .pipe(gulp.dest(ASSETS_PATH))
    .pipe(gulpIf(LIVERELOAD_ENABLED, livereload()))
});

gulp.task('watch', () => {
  gulp.watch(['src/views/**/*.html'], ['views']);
  gulp.watch(['src/styles/**/*.scss'], ['css']);
});

//gulp.task('prebuild', ['clean'])

gulp.task('build', ['clean'], (cb) => {
  runSequence(['js', 'css', 'assets'], 'views', cb)
})

gulp.task('dev-server', ['build'], (callback) => {
  let started = false;
  return nodemon({
    script: 'server.js',
    ext: 'html'
  }).on('start', () => {
    if (!started) {
      livereload.listen();
      callback();
      started = true;
    }
  });
});

gulp.task('dev', ['init-livereload'], (cb) => {
  runSequence('dev-server', 'watch', cb);
});

gulp.task('default', ['dev']);
