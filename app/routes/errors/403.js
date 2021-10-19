const ErrorGeneric = require("./generic");

class Error403 extends ErrorGeneric {
    constructor(method, url) {
        super(403, "Forbidden", `You don't have access to ${method.toUpperCase()} ${url}`);
    }
}

module.exports = Error403;