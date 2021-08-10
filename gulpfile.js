const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');

const host = "localhost";
const port = 80;

gulp.task("sass", function () {
    return gulp.src("app/assets/scss/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("app/assets/css/"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task("browserSync", function (cb) {
    return browserSync.init({
        proxy: "http://" + host + "/",
        files: [{
            match: ["app/assets/**/*.*", "app/views/**/*.*"],
            fn: function(e,f) {
                this.reload();
            }
        }],
        ignore: ["app/assets/scss/**/*.*"],
        open: false,
        port: port + 1
    }, cb);
});

gulp.task("nodemon", function (cb) {
    var started = false;

    return nodemon({
        script: 'server.js',
        env: {
            "NODE_ENV": 'dev',
            "BROWSER_SYNC_ACTIVE": true,
            "HOST": host,
            "PORT": port
        },
        watch: ["*.js", "./app/routes/*.js"]
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            started = true;
            console.log("Nodemon started.");
            setTimeout(cb, 1000);
        }
    }).on("restart", function() {
        setTimeout(() => browserSync.reload({}), 1000);
    });
});

gulp.task("watch", gulp.series("sass", function (cb) {
    gulp.watch("app/assets/scss/**/*.scss", gulp.series("sass"));
    cb();
}));

gulp.task("default", gulp.series("nodemon", "browserSync", "watch"));