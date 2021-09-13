class ErrorGeneric extends Error {
    constructor(code, name, message) {
        super(message);
        this.code = code;
        this.status = code;
        this.name = name;
    }

    static fromReq(req, ...args) {
        let e = new(this.prototype.constructor)(req.method, req.url, ...args);
        let stack = e.stack.split("\n");
        stack.splice(1, 1);
        e.stack = stack.join("\n");
        return e;
    }
}

module.exports = ErrorGeneric;

const notFound = require("./404");
const internalServerError = require("./500");
const notImplemented = require("./501");

module.exports.errors = {
    404: notFound,
    500: internalServerError,
    501: notImplemented,
    notFound,
    notImplemented,
    internalServerError,
};