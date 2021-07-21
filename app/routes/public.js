const router = require("express").Router();

router.get(["/", "/home"], (req, res) => {
    res.render("index", {
        time: new Date().toLocaleString()
    });
});

module.exports = router;