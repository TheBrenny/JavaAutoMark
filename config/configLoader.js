// allows us to TRY and require config.json
// if it fails, with MODULE_NOT_FOUND, use the default config below

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
        secret: "this is a secret",
        cookieName: "session"
    }
};

try {
    config = require('./config.json');
} catch (e) {
    if (e.code == 'MODULE_NOT_FOUND') console.log('config.json not found, using defaults');
    else throw e;
}

module.exports = config;