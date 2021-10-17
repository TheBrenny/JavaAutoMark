// allows us to TRY and require config.json
// if it fails, with MODULE_NOT_FOUND, use the default config below

const path = require("path");

let config = {
    storage: {
        provider: "localstorage",
        options: {
            "accessID": "",
            "secret": "",
            "container": "",
            "path": "./storage/data"
        }
    },
    sql: {
        url: undefined
    },
    session: {
        secret: process.env.SESSION_SECRET || "this is a secret",
        cookieName: process.env.SESSION_COOKIE || "session"
    },
    java: {
        java: process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, "bin", "java") : path.resolve(__dirname, "..", "app", "jenv", "bin", "jre11", "bin", "java"),
        compiler: process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, "bin", "javac") : path.resolve(__dirname, "..", "app", "jenv", "bin", "compiler.jar"),
    }
};

try {
    let newConf = require('./config.json');
    Object.assign(config, newConf);
} catch (e) {
    if (e.code == 'MODULE_NOT_FOUND') console.log('config.json not found, using defaults');
    else throw e;
}

module.exports = config;

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