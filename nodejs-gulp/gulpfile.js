var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	obfuscate = require('gulp-obfuscate');
	imagemin = require('gulp-imagemin'),
	// pngquant = require('imagemin-pngquant'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	del = require('del');

gulp.task('styles', function(){
	return gulp.src('src/styles/style.css')
		// .pipe(sass({style: 'extended'}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(notify({message: 'Styles task complete'}));
});

gulp.task('scripts', function(){
	return gulp.src('src/scripts/**/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		// .pipe(obfuscate())
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(notify({message: 'Script task complete'}));
});

gulp.task('images', function(){
	return gulp.src('src/images/**/*')
		.pipe(cache(imagemin({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true,
			// use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/assets/img'))
		.pipe(notify({message: 'Images task complete'}));
});

gulp.task('clean', function(cb){
	del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb);
});

gulp.task('default', ['clean'], function(){
	gulp.start('styles', 'scripts', 'images');
});

gulp.task('watch', function(){
	gulp.watch('src/styles/**/*.scss', ['styles']);
	gulp.watch('src/scripts/**/*.js', ['scripts']);
	gulp.watch('src/images/**/*', ['images']);

	// Create LiveReload server
  	livereload.listen();
  	// Watch any files in dist/, reload on change
  	gulp.watch(['dist/**']).on('change', livereload.changed);
});
