const filter = require('through2-filter').obj;
const merge = require('merge2');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const browserify = require('gulp-browserify');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const include = require('gulp-include');
const gulp = require('gulp');
const cache = require('gulp-cached');
const remember = require('gulp-remember');

const env = process.env.NODE_ENV

module.exports = (bundle, options) => {
  options = Object.assign({
    includePaths: [],
    iife: true,
    cacheName: 'js'
  }, options);

  return merge(
    gulp.src(require.resolve('ym')),
    bundle.src('js')
      .pipe(filter(f => ~['vanilla.js', 'browser.js', 'js'].indexOf(f.tech))),
    bundle.src('js').pipe(filter(f => f.tech === 'source.js'))
      .pipe(cache(options.cacheName))
      .pipe(browserify())
      .pipe(gulpif(options.iife, wrap({src: __dirname + '/../wrappers/iife.js'})))
      .pipe(remember(options.cacheName))
  )
  .pipe(include({
    hardFail: true,
    includePaths: options.includePaths
  }))
  .pipe(concat(bundle.name + '.min.js'))
};
