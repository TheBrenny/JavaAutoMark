const ErrorGeneric = require("./generic");

class Error400 extends ErrorGeneric {
    constructor(method, url, message) {
        super(400, "Bad Request", `${method.toUpperCase()} ${url} had a problem${message ? ". " + message : ""}`);
    }
}

module.exports = Error400;