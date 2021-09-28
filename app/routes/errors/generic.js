class ErrorGeneric extends Error {
    constructor(code, name, message) {
        super(message);
        this.code = code;
        this.status = code;
        this.name = name;
    }
}

module.exports = ErrorGeneric;
module.exports.errors = {
    404: require("./404")
};