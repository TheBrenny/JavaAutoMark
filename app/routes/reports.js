const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;
const { assignments } = require("../../db/database");

/* **************************** */
/*      PAGES FOR COURSES       */
/* **************************** */

router.use("/reports/*", (req, res, next) => {
    res.locals.pageTitle = "Reports";
    next();
});

router.get("/reports/assignment", async (req, res) => {
    console.log("test");

    res.render("reports/assignment", {
        course: "Red Rover"
    });
});

router.get("/reports/assignment/pdf", async (req, res) => {
    console.log("test");
    
    console.log('tester');
    res.render("reports/assignment/test.doc", {
        course: "Red Rover"
    });
});


module.exports = router;