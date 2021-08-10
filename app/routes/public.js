const router = require("express").Router();

router.get(["/", "/home"], (req, res) => {
    res.render("home", {
        time: new Date().toLocaleString(),
        user: account
    });
});

router.get(["/login"], (req, res) => {
    res.render("login", {
        
    });
});

router.get(["/create"], (req, res) => {
    res.render("createuser", {
        user: account
    });
});

router.get(["/user"], (req, res) => {
    res.render("viewuser", {
        user: account
    });
});

module.exports = router;

const account = {
    firstName: "Ethan",
    lastName: "Fraser",
    zID: "z5260786"
}