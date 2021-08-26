const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");

router.get(["/assignments/create"], (req, res) => {
    let s = session(req);

    res.render("newassignment", {});
});

module.exports = router;