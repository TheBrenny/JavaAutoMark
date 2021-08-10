const router = require("express").Router();

router.get(["/", "/home"], (req, res) => {
    res.render("home", {
        time: new Date().toLocaleString(),
        firstName: "Ethan"
    });
});

router.get(["/login"], (req, res) => {
    res.render("login", {
        
    });
});

router.get(["/create"], (req, res) => {
    res.render("createuser", {
        
    });
});

module.exports = router;