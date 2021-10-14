#!/env/node

(async () => {
    const fs = require('fs');
    const path = require("path");
    const installer = require("./install/install");

    let skipInstall = (process.argv.length > 2 && process.argv.includes("--skipInstall"));
    let forceInstall = (process.argv.length > 2 && process.argv.includes("--forceInstall"));

    if(!skipInstall && (!await installer.isInstalled() || forceInstall || await installer.shouldUpdate())) {
        let run = (forceInstall & 1) || await installer.checkInstall();
        if(run) {
            console.log(installer.colourText((run === 1 ? "Installing..." : "Updating..."), "blue", ["italic", "bold"]));
            await installer.install(forceInstall);
            console.log(installer.colourText("Finished " + (run === 1 ? "installing!" : "updating!"), "green", ["italic", "bold"]));
        } else {
            console.log(installer.colourText("Skipping installer.", "blue", "italic"));
        }
    }

    // Do config
    const config = require("./config");
    const serverInfo = config.serverInfo;

    // Load important modules
    const db = require("./db/db");
    const express = require("express");
    const scetch = require("scetch")();
    const morgan = require("morgan");
    const nonce = require("nonce-express");
    const helmet = require("helmet");
    const cors = require("cors");
    const session = require("express-session");
    const storage = require("./storage/storage");
    const websocket = require("./app/routes/tools/websocket");

    // Make the app
    let app = express();
    app.use(morgan('common', config.morgan));
    app.use(nonce());
    app.use(helmet(config.helmet));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(session({
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        store: db.sessionStore,
        name: config.session.cookieName
    }));

    // Start the app
    let appPath = path.join(__dirname, "app");

    app.set("views", path.join(appPath, "views"));
    app.engine("sce", scetch.engine);
    app.set("view engine", "sce");

    app.use("/assets", express.static(path.join(appPath, "assets")));
    app.use(require("./app/routes/routes"));

    // Error handling -- scoped to the root layer!
    const errRoutes = require("./app/routes/errors");
    app.all("/*", errRoutes.notFound);
    app.use(errRoutes.handler);

    let server = app.listen(serverInfo.port, serverInfo.host, () => {
        console.log(`Storage provider: ${storage.provider}`);
        console.log(`Server is listening at http://${serverInfo.host}:${serverInfo.port}...`);
        if(config.env.isDev) console.log(`Browsersync is probably available at http://${serverInfo.host}:${parseInt(serverInfo.port) + 1}...`);
    });
    websocket.setup(server);
})().catch(err => {
    console.error(err);
    process.exit(1);
});