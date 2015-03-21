var gulp = require('gulp'), 
    gulpif = require('gulp-if'),     
    sass = require('gulp-ruby-sass') 
    notify = require("gulp-notify") 
    sprite = require('css-sprite').stream
    bower = require('gulp-bower');

var config = {
     sassPath: './sass',
     bowerDir: './bower_components' 
}

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('css', function() { 
    return sass(config.sassPath + '/styles.scss', {
			style: 'compressed',
			loadPath: [
				config.bowerDir + '/bootstrap-sass-official/assets/stylesheets/',
			]
         	}) 
            .on("error", notify.onError(function (error) {
                 return "Error: " + error.message;
             })) 
         .pipe(gulp.dest('./css')); 
});
gulp.task('sprites', function () {
  return gulp.src('./img/sprites/*.png')
    .pipe(sprite({
      name: 'sprites',
      style: '_sprite.scss',
      cssPath: '../img',
      processor: 'scss'
    }))
    .pipe(gulpif('*.png', gulp.dest('./img/'), gulp.dest('./sass/')))
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
     gulp.watch('./img/sprites/*.png', ['sprites']);
    gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
});

  gulp.task('default', ['bower', 'sprites', 'css']);