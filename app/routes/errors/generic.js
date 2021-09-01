class ErrorGeneric extends Error {
    constructor(code, name, message) {
        super(message);
        this.code = code;
        this.status = code;
        this.name = name;
    }

    static fromReq(req) {
        let e = new(this.prototype.constructor)(req.method, req.url);
        let stack = e.stack.split("\n");
        stack.splice(1, 1);
        e.stack = stack.join("\n");
        return e;
    }
}

module.exports = ErrorGeneric;

const notFound = require("./404");
const notImplemented = require("./501");

module.exports.errors = {
    404: notFound,
    501: notImplemented,
    notFound,
    notImplemented
};