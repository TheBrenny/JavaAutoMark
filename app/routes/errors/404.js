const ErrorGeneric = require("./generic");

class Error404 extends ErrorGeneric {
    constructor(method, url) {
        super(404, "Not Found", `Could not ${method.toUpperCase()} ${url}`);
    }

    static fromReq(req) {
        return new Error404(req.method, req.url);
    }
}

module.exports = Error404;