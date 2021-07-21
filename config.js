let result = {
    morgan: {
        stream: process.env.IS_VSCODE ? {
            write: console.log
        } : process.stdout
    },
    browsersyncActive: !!process.env.BROWSER_SYNC_ACTIVE && process.env.BROWSER_SYNC_ACTIVE.toLowerCase() !== "false",
    helmet: {},
    serverInfo: {
        host: process.env.HOST || "localhost",
        port: process.env.PORT || 80
    },
    session: {
        secret: process.env.SECRET || "thisIsSecretHaHa",
    },
    debug: !!process.env.DEBUG && process.env.DEBUG.toLowerCase() !== "false",
};

result.helmet = result.browsersyncActive ? {
    contentSecurityPolicy: false
} : {};

module.exports = result;