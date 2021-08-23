const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");

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

router.get("/logout", async (req, res) => {
    session(req).setAccount(null);
    res.redirect("/");
});

router.get("/user", (req, res) => {
    res.redirect("/teachers/" + session(req).getAccount().id);
});

router.get("/teachers/view", async (req, res) => {
    // TODO: IMPLEMENT THIS!
    return res.status(501).send("not implemented").end();

    let teachers = await Database.teachers.getAll();
    teachers = Database.teachers.toObject(teachers);
    res.render("allteachers", {
        teachers: teachers,
    });
});

router.get("/teachers/:id", async (req, res) => {
    let id = req.params.id;
    let t = await Database.teachers.getUser(id);
    t = Database.teachers.toObject(t);

    res.render("viewuser", {
        teacher: t
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