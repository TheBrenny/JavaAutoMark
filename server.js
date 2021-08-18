// Do config
const config = require("./config");
const serverInfo = config.serverInfo;

// Load important modules
const db = require("./db/db");
const path = require("path");
const express = require("express");
const scetch = require("scetch")();
const morgan = require("morgan");
const nonce = require("nonce-express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const storage = require("./storage/storage")(config.storage.provider, config.storage.options);

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
app.use(require("./app/routes/public"));
app.use(require("./app/routes/account"));
app.use(require("./app/routes/errors"));

app.listen(serverInfo.port, serverInfo.host, () => {
    if (config.browsersyncActive) serverInfo.port = 81;
    console.log(`Server is listening at http://${serverInfo.host}:${serverInfo.port}...`);
});