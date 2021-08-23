require("dotenv").config();

const appConfig = require("./config/config.json");

const forceDev = false;

module.exports = {};

module.exports.db = {
    url: new URL(process.env.MYSQL_URL) || new URL(appConfig.sql.url) || undefined
};

module.exports.session = {
    secret: process.env.SESSION_SECRET || appConfig.session.secret || "this is the encryption secret",
    cookieName: process.env.SESSION_COOKIE || appConfig.session.cookieName || "session",
};

module.exports.env = {
    node: process.env.NODE_ENV || "production",
    isDev: forceDev
};
module.exports.env.isDev = module.exports.env.node.startsWith("dev") || forceDev;

module.exports.helmet = {
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'", "http:"],
            scriptSrc: [
                "'self'",
                "cdnjs.cloudflare.com",
                "kit.fontawesome.com",
                module.exports.env.isDev ? `'nonce-browsersync'` : "",
                (req, res) => `'nonce-${res.locals.nonce}'`,
            ],
            workerSrc: ["'self'", "blob:"],
            upgradeInsecureRequests: null
        }
    }
};

module.exports.morgan = {
    stream: process.stdout
};

module.exports.serverInfo = {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 80,
};

module.exports.storage = {
    provider: process.env.STORAGE || appConfig.storage.provider || "localstorage",
    options: !!process.env.STORAGE_OPTS ? JSON.parse(process.env.STORAGE_OPTS) : appConfig.storage.options || {
        path: "storage/data"
    }
};