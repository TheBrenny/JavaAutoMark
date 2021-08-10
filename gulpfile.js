const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');

const host = "jam";
const port = 80;

gulp.task("sass", function () {
    return gulp.src("app/assets/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(sourcemaps.write('.'))
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
            fn: function (e, f) {
                this.reload();
            }
        }],
        ignore: ["app/assets/scss/**/*.*"],
        open: false,
        port: port + 1,
        snippetOptions: {
            rule: {
                match: /<\/head>/i,
                fn: function (snippet, match) {
                    return snippet.replace('id=', `nonce="browsersync" id=`) + match;
                }
            }
        }
    }, cb);
});

gulp.task("nodemon", function (cb) {
    var started = false;

    nodemon({
        script: 'server.js',
        exec: "node --inspect=9229",
        env: {
            "NODE_ENV": 'dev',
            "GULPING": true,
            "HOST": host,
            "PORT": port
        },
        watch: ["*.js", "app/routes/"],
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            started = true;
            console.log("Nodemon started.");
            setTimeout(cb, 3000);
        }
    }).on('restart', function (...args) {
        setTimeout(() => browserSync.reload({}), 3000);
    });
});

gulp.task("watch", gulp.series("sass", function (cb) {
    gulp.watch("app/assets/scss/**/*.scss", gulp.series("sass"));
    cb();
}));

gulp.task("default", gulp.series("nodemon", "browserSync", "watch"));