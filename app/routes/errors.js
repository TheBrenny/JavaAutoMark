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
    if(!isProd) {
        e.stack = err.stack;
    }

    console.error(e);

    if(res.headersSent) {
        return next(err);
    }

    res.format({
        "json": () => res.json(e),
        "html": () => {
            if(!!e.stack) {
                e.stack = e.stack.split("\n").map((line, i) => {
                    if(i === 0 || line.indexOf("node_modules") === -1) line = `<span class="highlight">${line}</span>`;
                    return line;
                }).join("\n");
            }
            res.render("error", {
                "error": e
            });
        },
        "default": () => res.send(JSON.stringify(e)).end()
    });
});