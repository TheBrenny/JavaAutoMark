const express = require('express');
const router = express.Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;
const storage = require("../../storage/storage");
const config = require("../../config");
const CourseModel = require("../../db/models/courses");

router.get("/assignments", async (req, res) => {
    throw errors.notImplemented.fromReq(req);
});

router.get("/assignments/view", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);
    let assignments = Database.assignments.toObject(await Database.assignments.getAllAssignments(), CourseModel);

    res.render("assignments/view", {
        courses: courses,
        assignments
    });
});

router.get("/assignments/view/:id", async (req, res) => {
    throw errors.notImplemented.fromReq(req);
});

router.get("/assignments/submit/:id", express.raw({
    limit: "5mb"
}), (req, res) => {
    
    throw errors.notImplemented.fromReq(req);
});

router.get("/assignments/create", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    res.render("assignments/create", {
        courses: courses,
        assign: "{}",
        isCreate: true,
    });
});

router.get("/assignments/submit", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    res.render("assignments/submit", {
        courses: courses,
        assign: "{}",
        isCreate: true,
    });
});

router.post("/assignments/create", async (req, res) => {
    let assignment = req.body;

    assignment.javaName = assignment.javaName ?? assignment.name.replace(/\s/g, "_");

    let code = generateJavaCode(assignment);
    let path = assignment.class + "/" + assignment.name;

    let id;
    try {
        id = (await Database.assignments.addAssignment(assignment.name, assignment.class, path)).affectedID;
        Object.assign(assignment, {
            id: id
        });
        await storage.putObject(storage.container, path + ".java", code);
        await storage.putObject(storage.container, path + ".json", JSON.stringify(assignment, undefined, config.env.isDev ? 2 : undefined));
    } catch(e) {
        err = e;
        throw errors[500].fromReq(req, e.message);
    }

    res.setHeader("Location", "/assignments/edit/" + id);
    res.status(201).end();
});

router.get("/assignments/edit/:id", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    let assPath = Database.assignments.toObject(await Database.assignments.getAssignment(req.params.id)).code_location;
    let assJsonStream = await storage.getObject(storage.container, assPath + ".json");

    let chunks = [];
    for await(let chunk of assJsonStream) chunks.push(Buffer.from(chunk));
    chunks = Buffer.concat(chunks);
    chunks = chunks.toString("utf-8");
    chunks = chunks.replace(/\\/gm, "\\\\"); // escape backslashes

    res.render("assignments/create", {
        courses: courses,
        assign: chunks,
        assignObj: JSON.parse(chunks)
    });
});

router.put("/assignments/edit/:id", async (req, res) => {
    let id = req.params.id;
    let assignment = req.body;

    assignment.javaName = assignment.javaName ?? assignment.name.replace(/\s/g, "_");

    let code = generateJavaCode(assignment);
    let path = assignment.class + "/" + assignment.name;
    let err = null;

    try {
        // TODO: delete the old code if name or class has changed!
        await Database.assignments.updateAssignment(id, {
            assignment_name: assignment.name,
            course_uuid: assignment.class,
            code_location: path
        });
        Object.assign(assignment, {
            id: id
        });
        await storage.putObject(storage.container, path + ".java", code);
        await storage.putObject(storage.container, path + ".json", JSON.stringify(assignment, undefined, config.env.isDev ? 2 : undefined));
    } catch(e) {
        err = e;
        throw errors[500].fromReq(req, e.message);
    }

    res.status(200).json({
        success: !err,
        message: !!err ? err.message : "Assignment updated successfully!"
    });
});

// TODO: it would be cool if this could be exported and reused client side so
//       the client can get a live preview of what the resulting code looks like
function generateJavaCode(assignment) {
    let code = `public class ${assignment.javaName} {\n`;

    // for loop for all tasks in the assignment
    let main = "public static void main(String[] args) {\n";
    for(let i = 0; i < assignment.tasks.length; i++) {
        main += `task${i + 1}();\n`;
        code += `public static void task${i + 1}() {\n`;

        for(let j = 0; j < assignment.tasks[i].tests.length; j++) {
            let insertCode = assignment.tasks[i].tests[j].code;
            insertCode = insertCode.replace(/\r\n/gm, "\n").trim(); // strip crlf to just lf

            if(assignment.tasks[i].tests[j].testID !== undefined) {
                insertCode.replace(/;$/gm, ""); // strip trailing semicolon
                code += `System.out.println(${insertCode});\n`;
                code += `System.out.println(((Object) ${insertCode}).equals(${assignment.tasks[i].tests[j].expected}));\n`; // Object casting is needed to compare primitives
            } else {
                code += `${insertCode}\n`;
            }

            Object.assign(assignment.tasks[i].tests[j], {
                code: insertCode // save the sanitised code back
            });
        }

        code += `}\n`;
    }

    main += "}\n";
    code += main;

    code += `}\n`;

    return code;
}

module.exports = router;