const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;

router.get("/login", [
    checks.isGuest,
], async (req, res) => {
    res.locals.pageTitle = "Login";
    res.format({
        "json": () => res.json({
            success: false,
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

// This sets up the page title
router.use("/teachers/*", (req, res, next) => {
    res.locals.pageTitle = "Teachers";
    next();
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

    if(t == undefined) throw errors.notFound.fromReq(req);

    t = Database.teachers.toObject(t);

    res.render("teachers/single", {
        teacher: t
    });
});


router.get("/teachers/create", checks.isAdmin, (req, res) => {
    res.render("teachers/create", {});
});

router.post("/teachers/create", checks.isAdmin, async (req, res) => {
    let zid = req.body.zID.replace(/^z/g, "");
    let fname = req.body.fName;
    let lname = req.body.lName;
    let email = req.body.email;
    let password = req.body.pass;

    let bad = false;
    let target = (await Database.teachers.getTeacher(zid));

    // not found user
    if(target == undefined) {
        const passHash = crypto.hashSync(password, 12);
        bad = !(await Database.teachers.addTeacher(zid, email, fname, lname, passHash));
    } else {
        bad = true;
    }

    if(bad) {
        res.status(401).redirect("/admin/teachers/create");
    } else {
        res.redirect("/admin");
    }
});

router.post("/login", checks.isGuest, async (req, res) => {
    let zid = req.body.user.replace(/^z/g, "");
    zid = zid === "admin" ? 0 : zid; // converts admin to 0 as the account id for the db
    let password = req.body.pass;

    session(req).loginAttempt();

    let bad = false;
    let target = (await Database.teachers.getTeacher(zid));

    // found user
    if(target != undefined) {
        const passMatch = crypto.compareSync(password, target.teachers_password);
        if(passMatch) {
            session(req).setAccount(target.teachers_zid, target.teachers_fname, target.teachers_lname);
            session(req).getAccount().admin = target.teachers_zid === 0;
        } else {
            bad = true;
        }
    } else {
        hashPassword(password); // hash anyway to waste time.
        bad = true;
    }

    if(bad) {
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