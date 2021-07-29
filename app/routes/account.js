const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/Database");

router.get("/whoami", async (req, res) => {
    let s = session(req);
    let name = s.isAuthed() ? s.name() : "Just A Guest";

    res.format({
        "json": () => res.json({
            name
        }),
        "html": () => res.render("account/whoami", {
            name: name
        }),
    });
});

router.get("/login", [
    checks.isGuest,
], async (req, res) => {
    res.format({
        "json": () => res.json({
            message: "POST to /login"
        }),
        "html": () => res.render("account/login", {
            badLogin: session(req).getBadLogin(),
        }),
    });
    // res.render("login", {
    //     badLogin: session(req).getBadLogin(),
    // });
});

router.post("/login", [
        checks.isGuest,
    ],
    async (req, res) => {
        let {
            username,
            password,
        } = req.body;
        let rm = req.body.rememberme;

        session(req).loginAttempt();

        let bad = false;
        let target = (await Database.accounts.getUser(username));

        // found user
        if (target != undefined) {
            const passMatch = password == target.users_password; // crypto.compareSync(password, target.users_password);
            if (passMatch) {
                session(req).setAccount(target.users_id, target.users_username);
            } else {
                bad = true;
            }
        } else {
            // hashPassword(password); // hash anyway to waste time.
            bad = true;
        }

        if (bad) {
            session(req).badLogin("Invalid username or password!");
            res.status(401).redirect("/login");
        } else {
            if (rm == "on") rememberme.writeCookie(req, res);
            res.redirect("/");
        }
    });


module.exports = router;