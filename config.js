require("dotenv").config();

const appConfig = require("./config/configLoader");

const forceDev = false;

module.exports = {};

module.exports.db = {
    url: tryNew(URL, process.env.MYSQL_URL) || new URL(appConfig.sql.url)
};

module.exports.session = {
    secret: process.env.SESSION_SECRET || appConfig.session.secret,
    cookieName: process.env.SESSION_COOKIE || appConfig.session.cookieName,
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
    provider: process.env.STORAGE || appConfig.storage.provider,
    options: tryDo(JSON.parse, process.env.STORAGE_OPTS) || appConfig.storage.options
};

function tryDo(fn, param, thisArg) {
    try {
        if (!!param) return fn.call(thisArg, param);
    } catch (e) {}
    return false;
}

function tryNew(clazz, param) {
    try {
        if (!!param) return new clazz(param);
    } catch (e) {}
    return false;
}