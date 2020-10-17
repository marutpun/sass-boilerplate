const { src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');

const baseDirectory = './src/scss/**/*.s+(a|c)ss';
const serveDirectory = './public/';
const distDirectory = `${serveDirectory}/css`;

function sassBuild() {
	return src(baseDirectory)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(distDirectory));
}

function sassTranspile() {
	return src(baseDirectory).pipe(sass().on('error', sass.logError)).pipe(sass().on('error', sass.logError)).pipe(dest(distDirectory));
}

function styleLint() {
	return src(baseDirectory)
		.pipe(
			sassLint({
				config: './utils/.sass-lint.yml',
			})
		)
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
}

function defaultTask() {
	// BrowserSync init
	browserSync.init({
		server: serveDirectory,
	});

	// Re-built after file change.
	watch(baseDirectory, sassTranspile);

	// Re-load after file change.
	watch(serveDirectory).on('change', browserSync.reload);
}

exports.build = sassBuild;
exports.lint = styleLint;
exports.default = defaultTask;
