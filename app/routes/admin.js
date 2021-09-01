const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");
const config = require("../../config");

// This is used to make sure that the user access these pages are admins
router.use("/admin/*", (req, res, next) => {
    if (config.env.isDev) next(); // TODO: TEST THIS BEFORE PRODUCTION!
    else checks.isAdmin(req, res, next);
});

router.get("/admin", (req, res) => {
    res.render("admin", {});
});

router.get("/admin/teachers/create", checks.isAuthed, (req, res) => {
    res.render("createuser", {});
});

router.post("/admin/teachers/create", async (req, res) => {
    let zid = req.body.zID.replace(/^z/g, "");
    let fname = req.body.fName;
    let lname = req.body.lName;
    let email = req.body.email;
    let password = req.body.pass;

    let bad = false;
    let target = (await Database.teachers.getTeacher(zid));

    // not found user
    if (target == undefined) {
        const passHash = crypto.hashSync(password, 12);
        bad = !(await Database.teachers.addTeacher(zid, email, fname, lname, passHash));
    } else {
        bad = true;
    }

    if (bad) {
        res.status(401).redirect("/admin/teachers/create");
    } else {
        res.redirect("/admin");
    }
});

module.exports = router;