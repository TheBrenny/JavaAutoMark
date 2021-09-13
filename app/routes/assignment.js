const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;
const storage = require("../../storage/storage");
const config = require("../../config");

router.get("/assignments", async (req, res) => {
    throw errors.notImplemented.fromReq(req);
});

router.get("/assignments/view", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    res.render("assignments/view", {
        courses: courses,
        tasks: "{}"
    });
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
        assign: "{}",
    });
});

router.post("/assignments/create", async (req, res) => {
    let assignment = req.body;

    let code = `public class ${assignment.name} {\n`;

    // for loop for all tasks in the assignment
    for (let i = 0; i < assignment.tasks.length; i++) {
        code += `public static void task${i}() {\n`;

        for (let j = 0; j < assignment.tasks[i].tests.length; j++) {
            let insertCode = assignment.tasks[i].tests[j].code;
            insertCode = insertCode.replace(/\r\n/gm, "\n").trim(); // strip crlf to just lf

            if (assignment.tasks[i].tests[j].testID !== undefined) {
                insertCode.replace(/;$/gm, ""); // strip trailing semicolon
                code += `System.out.println(${insertCode});\n`;
                code += `System.out.println(((Object) ${insertCode}).equals(${assignment.tasks[i].tests[j].expected}));\n`; // Object casting is needed to compare primitives
            } else {
                code += `${insertCode}\n`;
            }

            assignment.tasks[i].tests[j].code = insertCode; // save the sanitised code back
        }

        code += `}\n`;
    }

    code += `}\n`;

    let path = assignment.class + "/" + assignment.name;

    // TODO: wrap with a try catch so we don't commit if something fails
    await storage.putObject(storage.container, path + ".java", code);
    await storage.putObject(storage.container, path + ".json", JSON.stringify(assignment, undefined, config.env.isDev ? 2 : undefined));
    let id = (await Database.assignments.addAssignment(assignment.name, assignment.class, path)).affectedID;

    res.setHeader("Location", "/assignments/edit/" + id);
    res.status(201).end();
});

router.get("/assignments/edit/:id", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    let assPath = Database.assignments.toObject(await Database.assignments.getAssignment(req.params.id)).code_location;
    let assJsonStream = await storage.getObject(storage.container, assPath + ".json");

    let chunks = [];
    for await (let chunk of assJsonStream) chunks.push(Buffer.from(chunk));
    chunks = Buffer.concat(chunks);
    chunks = chunks.toString("utf-8");
    chunks = chunks.replace(/\\/gm, "\\\\"); // escape backslashes

    res.render("assignments/create", {
        courses: courses,
        assign: chunks,
    });
});

module.exports = router;