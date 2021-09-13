const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;
const storage = require("../../storage/storage");

router.get("/assignments", async (req, res) => {
    throw errors.notImplemented.fromReq(req);
});

router.get("/assignments/view/:id", async (req, res) => {
    throw errors.notImplemented.fromReq(req);
});

router.get("/assignments/submit/:id", (req, res) => {
    throw errors.notImplemented.fromReq(req);
});

router.get("/assignments/create", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    res.render("assignments/create", {
        courses: courses,
        tasks: "{}"
    });
});

router.get("/assignments/view", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    res.render("assignments/view", {
        courses: courses,
        tasks: "{}"
    });
});

router.post("/assignments/create", async (req, res) => {
    // throw errors[501].fromReq(req);

    // TODO: Save to DB and save to file
    // JSON of the assignment will be saved next to the actual Java file in our Storage Provider.
    // The DB will hold the location of the JSON file (the Java file will be the same name but .java).

    let assignment = req.body;

    let code = `public class ${assignment.name} {\n`;

    // for loop for all tasks in the assignment
    for (let i = 0; i < assignment.tasks.length; i++) {
        code += `public static void task${i} {\n`;
        for (let j = 0; j < assignment.tasks.tests.length; j++) {
            code += `${assignment.tasks[i].tests[j].code}`;

            code += `System.out.println(${assignment.tasks[i].tests[j].code});`;
            code += `System.out.println(${assignment.tasks[i].tests[j].code}.equals(${assignment.tasks[i].tests[j].expected}));`;
        }

        code += `}`;
    }

    code += `}`;


    let path = assignment.class + "/" + assignment.name;
    // await Database.assignments.addAssignment(assignment.name, assignment.class, path);
    await storage.putObject(storage.container, path + ".java", code);
    await storage.putObject(storage.container, path + ".json", JSON.stringify(assignment));

    let id = (await Database.assignments.addAssignment(assignment.class, "somehwere")).id;
    res.setHeader("Location", "/assignments/edit/" + id);
    res.status(201).end();
});

//router.get("/assignments/edit/:id", (req, res) => {
//   throw errors.notImplemented.fromReq(req);
//});

module.exports = router;