const express = require('express');
const router = express.Router();
const isProd = !(require("../../config").env.isDev);

// 404
router.use((req, res, _) => {
    throw {
        code: 404,
        name: "Not Found",
        message: `Could not ${req.method.toUpperCase()} ${req.url}`
    };
});

router.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;
    res.status(statusCode);
    req.headers.accept = req.headers.accept.replace(/\*\/\*(;q=.+?|\s+?)(,|$)/g, ""); // i can't remember what this does...

    let e = {
        code: statusCode,
        name: err.name || "Error",
        message: err.message
    };

    // don't send the stack because of security risk!
    if (!isProd) {
        e.stack = err.stack;
    }

    res.format({
        "json": () => res.json(e),
        "html": () => res.render("error", {
            "error": e
        }),
    });

    // if (req.accepts("text/html")) {
    //     res.render("error", {
    //         error: e
    //     });
    // } else if (req.accepts("application/json")) {
    //     res.json(e);
    // } else res.end();
});

module.exports = router;