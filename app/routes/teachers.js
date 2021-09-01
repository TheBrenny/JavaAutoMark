const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;

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
    res.redirect("/teachers/view/" + session(req).getAccount().zid);
});

router.get("/teachers/view", async (req, res) => {
    throw errors.notImplemented.fromReq(req);

    let teachers = await Database.teachers.getAllTeachers();
    teachers = Database.teachers.toObject(teachers);
    res.render("allteachers", {
        teachers: teachers,
    });
});

router.get("/teachers/view/:id", async (req, res) => {
    let id = req.params.id.replace(/^z/g, "");
    let t = await Database.teachers.getTeacher(id);

    if (t == undefined) throw errors.notFound.fromReq(req);

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
    let target = (await Database.teachers.getTeacher(zid));

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