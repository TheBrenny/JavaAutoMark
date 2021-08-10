// TODO: Allow scetch to automatically add variables to each response!

const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");

router.get(["/", "/home"], (req, res) => {
    let s = session(req);
    let name = s.isAuthed() ? s.name() : null;

    res.render("home", {
        time: new Date().toLocaleString(),
        name
    });
});

// router.get(["/login"], (req, res) => {
//     res.render("login", {
//         firstName: "Ethan"
//     });
// });

// router.get(["/create"], (req, res) => {
//     res.render("createuser", {
//         firstName: "Ethan"
//     });
// });

module.exports = router;