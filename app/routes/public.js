const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");

// This makes sure the user is logged in or 
router.use((req, res, next) => {
    if(req.path === "/login") next();
    else checks.isAuthed(req, res, next);
});
router.use((req, res, next) => {
    let s = session(req);
    res.locals.user = s.getAccount();
    next();
});

// This is the home route
router.get(["/", "/home"], (req, res) => {
    res.locals.pageTitle = "Home";
    let s = session(req);

    res.format({
        html: () => {
            res.render("home", {
                title: "Home",
            });
        },
        json: () => {
            res.json({
                success: true,
                version: require("../../package.json").version,
            });
        }
    });
});

module.exports = router;