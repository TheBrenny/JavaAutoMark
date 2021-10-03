const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;

router.get("/courses/edit/:id", async (req, res) => {
    throw errors[501].fromReq(req);
});

/* **************************** */
/*      PAGES FOR COURSES       */
/* **************************** */

router.use("/courses/*", (req, res, next) => {
    res.locals.pageTitle = "Courses";
    next();
});

router.get("/courses/create", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    res.render("courses/create", {
        courses: courses,
        assign: "{}",
        isCreate: true,
    });
});

router.get("/courses/view", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);
    
    res.render("courses/view", {
        courses: courses
    });
});

router.get("/courses/ind/:id", async (req, res) => {
    let course = await Database.courses.getCourse(req.params.id);
    course = Database.courses.toObject(course);

    res.render("courses/ind", {
        course,
    });
});

module.exports = router;