const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");

router.get(["/assignments/create"], (req, res) => {
    let s = session(req);

    res.render("newassignment", {
        classes: ["ZEIT3101","ZEIT3102", "ZEIT3121", "ZEIT1104"]
    });
});

router.post("/assignments/create", (req, res) => {

});

module.exports = router;