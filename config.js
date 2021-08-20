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
    provider: process.env.STORAGE || "localstorage",
    options: !!process.env.STORAGE_OPTS ? JSON.parse(process.env.STORAGE_OPTS) : {
        path: "storage/data"
    }
};
// If non-local storage is used, add a default value for the container
if (module.exports.storage.provider !== "localstorage" && module.exports.storage.options.container == undefined) {
    module.exports.storage.options.path = "storage/data";
}