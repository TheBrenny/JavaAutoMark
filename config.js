require("dotenv").config();
const path = require("path");

const appConfig = require("./config/configLoader");

const forceDev = false;

module.exports = {};

module.exports.db = {
    url: tryNew(URL, process.env.MYSQL_URL) || new URL(appConfig.sql.url)
};

module.exports.session = {
    secret: appConfig.session.secret,
    cookieName: appConfig.session.cookieName,
};

module.exports.env = {
    node: process.env.NODE_ENV || "production",
    isDev: forceDev
};
module.exports.env.isDev = module.exports.env.node.startsWith("dev") || forceDev;

// TODO: Make this more strict!
module.exports.helmet = {
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'", "http:"],
            connectSrc: ["'self'", "https:", "ws:"],
            scriptSrc: [
                "'self'",
                "cdnjs.cloudflare.com",
                "kit.fontawesome.com",
                (req, res) => `'nonce-${res.locals.nonce}'`,
            ],
            workerSrc: ["'self'", "blob:"],
            upgradeInsecureRequests: null
        }
    }
};

if(module.exports.env.isDev) {
    module.exports.helmet.contentSecurityPolicy.directives.scriptSrc.push(`'nonce-browsersync'`);
    module.exports.helmet.contentSecurityPolicy.directives.connectSrc.push("http:");
}

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

module.exports.java = {
    java: appConfig.java.java || "java",
    compiler: appConfig.java.compiler || "javac",
};

function tryDo(fn, param, thisArg) {
    try {
        if(!!param) return fn.call(thisArg, param);
    } catch(e) {}
    return false;
}

function tryNew(clazz, param) {
    try {
        if(!!param) return new clazz(param);
    } catch(e) {}
    return false;
}