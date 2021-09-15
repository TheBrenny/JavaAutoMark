const isProd = !(require("../../config").env.isDev);
const errors = require("./errors/generic").errors;

module.exports = {};

// 404
module.exports.notFound = ((req, res, _) => {
    throw errors.notFound.fromReq(req);
});
// Catches errors
module.exports.handler = ((err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : err.code || 500;
    res.status(statusCode);

    let e = {
        code: statusCode,
        name: err.name || "Error",
        message: err.message
    };

    // don't send the stack because of security risk!
    if (!isProd) {
        e.stack = err.stack;
    }

    console.error(e);

    if (res.headersSent) {
        return next(err);
    }
    
    // req.headers.accept = req.headers.accept.replace(/\*\/\*(;q=.+?|\s+?)(,|$)/g, ""); // this actually deletes the catch-all accept header

    res.format({
        "json": () => res.json(e),
        "html": () => res.render("error", {
            "error": e
        }),
        "default": () => res.send(JSON.stringify(e)).end()
    });
});