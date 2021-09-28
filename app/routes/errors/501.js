const ErrorGeneric = require("./generic");

class Error501 extends ErrorGeneric {
    constructor(method, url) {
        super(501, "Not Implemented", `${method.toUpperCase()} ${url} is not implemented yet`);
    }
}

module.exports = Error501;