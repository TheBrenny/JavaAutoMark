require("dotenv").config();
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const realFavicon = require('gulp-real-favicon');
const Transform = require("stream").Transform;
const fs = require('fs');

const FAVICON_DATA_FILE = "./app/assets/img/favicon/faviconData.json";
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 80;

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('genicon', function (done) {
    realFavicon.generateFavicon({
        masterPicture: './app/assets/img/jar_coloured_transparent.png',
        dest: './app/assets/img/favicon/',
        iconsPath: '/assets/img/favicon/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#f6daff',
                margin: '11%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                },
                appName: 'Java Auto Mark'
            },
            desktopBrowser: {
                design: 'raw'
            },
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#f6daff',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                },
                appName: 'Java Auto Mark'
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#f3f3f4',
                manifest: {
                    name: 'JAM',
                    display: 'browser',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: true,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#fe6448'
            }
        },
        settings: {
            scalingAlgorithm: 'NearestNeighbor',
            errorOnImageTooSmall: false,
            readmeFile: true,
            htmlCodeFile: true,
            usePathAsIs: false
        },
        versioning: {
            paramName: 'v',
            paramValue: '1'
        },
        markupFile: FAVICON_DATA_FILE
    }, function () {
        done();
    });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('injecticon', function () {
    return gulp.src(["./app/views/partials/meta.sce"])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe((function () {
            const transformStream = new Transform({
                objectMode: true
            });

            transformStream._transform = function (file, encoding, callback) {
                if (file.isNull()) {
                    callback(null, file);
                    return;
                }

                if (file.isStream()) {
                    console.log("Cannot op on stream");
                    callback(null, file);
                    return;
                }

                let error = null;
                let curBuf = file.contents;

                let content = curBuf.toString();
                content = content.replace(/<\/(body|html)>/g, "");

                let newBuf = Buffer.alloc(content.length, content);
                file.contents = newBuf;

                callback(error, file);
            };
            return transformStream;
        })())
        .pipe(gulp.dest('./app/views/partials/'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('updateicon', function (done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function (err) {
        if (err) {
            throw err;
        }
    });
});

gulp.task("sass", function () {
    return gulp.src("app/assets/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("app/assets/css/"));
});

gulp.task("browserSync", function (cb) {
    return browserSync.init({
        injectChanges: true,
        proxy: "http://" + host + "/",
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
            "NODE_ENV": 'development',
            "HOST": host,
            "PORT": port
        },
        watch: ["*.js", "app/routes/"],
        ignore: "app/assets/js/"
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

    // Catch and stream changes
    gulp.watch(["app/assets/**/*.*", "!**/*.map", "!app/assets/scss/**"]).on("all", streamFileChanges);
    // gulp.watch("app/assets/js/**/*.js").on("all", streamFileChanges);
    // gulp.watch("app/assets/img/**/*.*").on("all", streamFileChanges);
    cb();
}));

function streamFileChanges(event, path) {
    gulp.src(path).pipe(browserSync.stream());
}

gulp.task("default", gulp.series("nodemon", "browserSync", "watch"));