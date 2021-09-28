const ErrorGeneric = require("./generic");

class Error409 extends ErrorGeneric {
    constructor(method, url) {
        super(409, "Conflict", `${method.toUpperCase()} ${url} isn't in a a good state right now`);
    }
}

module.exports = Error409;