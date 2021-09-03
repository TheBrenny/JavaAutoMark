const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;

router.get("/assignments/create", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    res.render("newassignment", {
        courses: courses,
        tasks: "{}"
    });
});

router.post("/assignments/create", async (req, res) => {
    // throw errors[501].fromReq(req);

    // TODO: Save to DB and save to file

    let id = Math.floor(Math.random() * 10);

    res.setHeader("Location", "/assignments/edit/" + id);
    res.status(201).end();
});

router.get("/assignments/edit/:id", (req, res) => {
    throw errors.notImplemented.fromReq(req);
});

module.exports = router;