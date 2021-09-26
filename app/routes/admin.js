const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");
const config = require("../../config");

// This sets up the page title
router.use(["/admin", "/admin/*"], (req, res, next) => {
    res.locals.pageTitle = "Admin Panel";
    next();
});

module.exports = router;