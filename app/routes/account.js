const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");

router.get(["/user"], (req, res) => {
    let s = session(req);

    res.render("viewuser", {
    });
});

router.get("/createteacher", checks.isAuthed, (req, res) => {
    let s = session(req);

    res.render("createuser", {
    });
});

router.post("/createteacher", async (req, res) => {
    let zid = req.body.zID.replace(/^z/g, "");
    let fname = req.body.fName;
    let lname = req.body.lName;
    let email = req.body.email;
    let password = req.body.pass;

    let bad = false;
    let target = (await Database.teachers.getUser(zid));

    // not found user
    if (target == undefined) {
        const passHash = crypto.hashSync(password, 12);
        bad = !(await Database.teachers.addUser(zid, email, fname, lname, passHash));
    } else {
        bad = true;
    }

    if (bad) {
        res.status(401).redirect("/createteacher");
    } else {
        res.redirect("/admin");
    }
});

router.get("/logout", async (req, res) => {
    session(req).setAccount(null);
    res.redirect("/");
});

router.get("/login", [
    checks.isGuest,
], async (req, res) => {
    res.format({
        "json": () => res.json({
            message: "POST to /login"
        }),
        "html": () => res.render("login", {
            badLogin: session(req).getBadLogin(),
        }),
    });
});

router.post("/login", checks.isGuest, async (req, res) => {
    let zid = req.body.user.replace(/^z/g, "");
    let password = req.body.pass;

    session(req).loginAttempt();

    let bad = false;
    let target = (await Database.teachers.getUser(zid));

    // found user
    if (target != undefined) {
        const passMatch = crypto.compareSync(password, target.teachers_password);
        if (passMatch) {
            session(req).setAccount(target.teachers_zid, target.teachers_fname, target.teachers_lname);
        } else {
            bad = true;
        }
    } else {
        hashPassword(password); // hash anyway to waste time.
        bad = true;
    }

    if (bad) {
        session(req).badLogin("Invalid id or password!");
        res.status(401).redirect("/login");
    } else {
        // if (rm == "on") rememberme.writeCookie(req, res);
        res.redirect("/");
    }
});


function hashPassword(p) {
    crypto.hashSync(p, 12);
}

module.exports = router;