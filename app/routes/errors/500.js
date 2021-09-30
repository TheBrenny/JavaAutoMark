const ErrorGeneric = require("./generic");

class Error500 extends ErrorGeneric {
    constructor(method, url, message) {
        super(500, "Internal Server Error", `${method.toUpperCase()} ${url} had a problem${message ? ". " + message : ""}`);
    }
}

module.exports = Error500;