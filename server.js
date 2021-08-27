(async () => {
    const fs = require('fs');
    const path = require("path");
    let skipInstall = (process.argv.length > 2 && process.argv.includes("--skipInstall"));
    let forceInstall = (process.argv.length > 2 && process.argv.includes("--forceInstall"));
    if (!skipInstall && (!fs.existsSync(path.resolve(".", "install", "install.lock")) || forceInstall)) {
        console.log("\x1b[3;34mInstalling...\x1b[0m");
        let installer = require("./install/install");
        let run = await installer.checkInstall();
        if (run) {
            await installer.install();
            console.log(installer.colourText("Installation complete!", "bright green", "italic"));
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

    app.listen(serverInfo.port, serverInfo.host, () => {
        if (config.browsersyncActive) serverInfo.port = 81;
        console.log(`Server is listening at http://${serverInfo.host}:${serverInfo.port}...`);
    });
})().catch(err => {
    console.error(err);
    process.exit(1);
});