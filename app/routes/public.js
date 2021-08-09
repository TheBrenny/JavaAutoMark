const router = require("express").Router();

router.get(["/", "/home"], (req, res) => {
    res.render("home", {
        time: new Date().toLocaleString()
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;