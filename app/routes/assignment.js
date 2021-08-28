const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const Database = require("../../db/database");

router.get("/assignments/create", async (req, res) => {
    let courses = await Database.courses.getAllCourses();

    res.render("newassignment", {
        classes: courses
    });
});

router.post("/assignments/create", (req, res) => {

});

module.exports = router;