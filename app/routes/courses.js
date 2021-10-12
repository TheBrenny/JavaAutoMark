const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;
const { assignments } = require("../../db/database");

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
    let years = courses.map(c => c.running_year).filter((v,i,a) => i === a.indexOf(v));
    
    res.render("courses/view", {
        courses: courses,
        years: years,
    });
});

router.get("/courses/ind/:id", async (req, res) => {
    let course = await Database.courses.getCourse(req.params.id);
    course = Database.courses.toObject(course);

    res.render("courses/ind", {
        course
    });
});

router.post("/admin/courses/create", async (req, res) => {

    let id = req.body.id;
    let name = req.body.name;
    let year = req.body.year;

    let bad = false;
    let target = (await Database.courses.getCourse(id, year));

    // not found user
    if(target == undefined) {
        bad = !(await Database.courses.addCourse(id, name, year));
    } else {
        res.status(500).json({
            success: false,
            message: "Course already exists!"
        });
        return;
    }

    if(bad) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    } else {
        res.status(201).json({
            success: true,
            redirect: "/courses/view",
            message: "Course added successfully!"
        });
    }
});

router.post("/admin/courses/del", async(req, res) => {

    let bad = true;
    let id = req.body.id;

    bad = !(await Database.courses.deleteCourse(id));


    if(!bad) {
        res.status(201).json({
            success: true,
            redirect: "/courses/view",
            message: "Course deleted successfully!"
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }
});

module.exports = router;