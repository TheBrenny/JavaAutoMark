require("dotenv").config();

const forceDev = false;

module.exports = {};

module.exports.db = {
    url: new URL(process.env.MYSQL_URL) || undefined
};

module.exports.session = {
    secret: process.env.SESSION_SECRET || "this is the encryption secret",
    cookieName: process.env.SESSION_COOKIE || "session",
    rememberName: process.env.REMEMBER_NAME || "remme",
};

module.exports.env = {
    node: process.env.NODE_ENV || "production",
    deploy: process.env.DEPLOY || "local",
    gulping: process.env.GULPING == "true",
    isDev: forceDev
};
module.exports.env.isDev = module.exports.env.node.startsWith("dev") || forceDev;

module.exports.helmet = !module.exports.env.gulping ? {
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrc: ["'self'", "'unsafe-inline'"] // TODO: Change this to `nonce-`s -- you can use res.locals.nonce to have the nonce variable available in scetch
        }
    }
} : {
    contentSecurityPolicy: false
};

module.exports.morgan = {
    stream: process.stdout
};


module.exports.serverInfo = {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 80,
};