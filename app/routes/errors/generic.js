class ErrorGeneric extends Error {
    constructor(code, name, message) {
        super(message);
        this.code = code;
        this.status = code;
        this.name = name;
    }

    static fromReq(req) {
        return new(this.prototype.constructor)(req.method, req.url);
    }
}

module.exports = ErrorGeneric;
module.exports.errors = {
    404: require("./404"),
    501: require("./501")
};