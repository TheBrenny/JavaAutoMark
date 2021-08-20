// Allow scetch to automatically add variables to each response!
// SOLVED: USE res.locals.* to add things to a scetch page that are always going to be there!!!

const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");

router.use((req, res, next) => {
    if(req.path === "/login") next();
    else checks.isAuthed(req,res,next);
});

router.get(["/", "/home"], (req, res) => {
    let s = session(req);

    res.render("home", {
        time: new Date().toLocaleString(),
        user: s.getAccount()
    });
});

router.get(["/newassignment"], (req, res) => {
    let s = session(req);

    res.render("newassignment", {
        user: s.getAccount()
    });
});

router.get(["/admin"], (req, res) => {
    let s = session(req);

    res.render("admin", {
        user: s.getAccount()
    });
});

router.get(["/viewteacher"], (req, res) => {
    let s = session(req);

    res.render("viewteacher", {
        user: s.getAccount()
    });
});


module.exports = router;
