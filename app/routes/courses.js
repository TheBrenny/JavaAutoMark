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
        bad = true;
    }

    if(bad) {
        res.status(401).redirect("/admin/courses/create");
    } else {
        res.redirect("/courses/view");
    }
});

router.post("/admin/courses/del", async(req, res) => {

    console.log("FUCK");
    // let bad = true;
    // let id = req.body.id;
    
    // let target = (await Database.courses.getCourse(id));
    // console.log(target);
    // run = (await Database.courses.deleteCourse(id));
    // console.log(bad);


    // if(bad) {
    //     res.redirect("/courses/ind/" + id);
    // } else {
    //     res.redirect("/courses/view");
    // }
});

module.exports = router;