const session = require("./session");

function matchingId(req, _res, next) {
    if (parseInt(req.params.id) === session(req).getAccount().id) next();
    else {
        let e = new Error("You don't seem to be the right user to access this operation");
        e.statusCode = 403;
        throw e;
    }
}

function isAuthed(req, res, next) {
    if (session(req).isAuthed()) next();
    else {
        res.status(401);
        if (req.accepts("text/html")) res.redirect("/login");
        else res.json({
            success: false,
            message: "You need to be authenticated to do this."
        });
    }
}

function isGuest(req, res, next) {
    if (session(req).isAuthed()) {
        res.status(400);
        if (req.accepts("text/html")) res.redirect("/");
        else res.json({
            success: false,
            message: "This action is only for guests. Please log out first."
        });
    } else next();
}

function isAdmin(req, res, next) {
    if (session(req).isAuthed() && session(req).isAdmin()) next();
    else {
        res.status(403);
        res.format({
            "json": () => res.json({
                success: false,
                message: "You don't seem to be the right user to access this operation."
            }),
            "html": () => res.redirect("/")
        });
    }
}

module.exports = {
    matchingId,
    isAuthed,
    isGuest,
    isAdmin
};