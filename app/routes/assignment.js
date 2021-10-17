const express = require('express');
const router = express.Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;
const storage = require("../../storage/storage");
const config = require("../../config");
const CourseModel = require("../../db/models/courses");
const multer = require('multer');
const path = require("path");
const fs = require("fs");
const stream = require("stream");
const java = require('../jenv/java');
const generateJavaCode = require("../assets/js/generateJavaCode");
const ErrorGeneric = require('./errors/generic');
const devNull = process.platform === "win32" ? "\\\\.\\nul" : "/dev/null";
const plimit = import("p-limit");
const websocket = require("./tools/websocket");
const MarkerManager = require("./tools/marker").MarkerManager;


/* ******************************** */
/*      PAGES FOR ASSIGNMENTS       */
/* ******************************** */

// This sets up the page title
router.use("/assignments/*", (req, res, next) => {
    res.locals.pageTitle = "Assignments";
    next();
});

router.get("/assignments", async (req, res) => {
    res.redirect(301, "/assignments/view");
});

router.get("/assignments/view", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);
    let years = courses.map(c => c.running_year).filter((v, i, a) => a.indexOf(v) === i);
    let courseOpts = courses.map(c => c.course_name).filter((v, i, a) => a.indexOf(v) === i);
    let assignments = Database.assignments.toObject(await Database.assignments.getAllAssignments(), CourseModel);

    res.render("assignments/view", {
        courses,
        courseOpts,
        years,
        assignments
    });
});

// ==================== Deprecated in favour of GET /assignments/submit
// router.get("/assignments/marked", async (req, res) => {
//     let courses = await Database.courses.getAllCourses();
//     courses = Database.courses.toObject(courses);

//     res.render("assignments/marked", {
//         courses: courses,
//         assign: "{}",
//         isCreate: true,
//     });
// });

const multerStore = path.resolve(__dirname, "..", "jenv", "context");
const multerStoreEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        let assId = req.params.id;
        let filepath = file.originalname.split("/");
        filepath.pop();

        while(filepath.length > 0 && filepath[0].match(/^z\d{7}/) === null) filepath.shift();
        if(filepath.length === 0) {
            let error = new Error("Bad directory structure encountered: " + file.originalname);
            error.code = 400;
            return cb(error, null);
        }

        filepath[0] = filepath[0].replace(/(z\d{7}).*/, "$1");
        filepath = path.join(multerStore, assId, filepath[0]); // removes all other parts of the dir to make sure java files are top-most
        fs.mkdirSync(filepath, {recursive: true});
        cb(null, filepath);
    },
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname));
    }
});
router.get("/assignments/submit/:id", async (req, res) => {
    let assignment = await Database.assignments.getAssignment(req.params.id);
    assignment = Database.assignments.toObject(assignment, CourseModel);

    let websockUrl = websocket.getSocket(`#${req.params.id}`)?.path ?? "";

    res.render("assignments/submit", {
        assignment,
        websockUrl,
    });
});
router.put("/assignments/submit/:id", async (req, res, next) => {
    // MAKE SURE WE'RE NOT CURRENTLY PROCESSING - OTHERWISE RACES WILL OCCUR!
    let assignment = Database.assignments.toObject(await Database.assignments.getAssignment(req.params.id));
    if(assignment.state === "processing") throw errors.conflict.fromReq(req);
    next();
}, multer({
    storage: multerStoreEngine,
    preservePath: true,
    fileFilter: (req, file, cb) => cb(null, file.originalname.endsWith(".java")),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB per file
    }
}).array("file"), (req, res, next) => onStudentAssignmentsUploaded(req, res).catch((e) => {
    console.error("Something went wrong!");
    console.error(e);
    next(e);
}));

router.get("/assignments/create", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    res.render("assignments/create", {
        courses: courses,
        assign: "{}",
        isCreate: true,
    });
});

router.get("/assignments/edit/:id", async (req, res) => {
    let courses = await Database.courses.getAllCourses();
    courses = Database.courses.toObject(courses);

    let ass = await Database.assignments.getAssignment(req.params.id);
    if(ass === null || ass === undefined) throw errors.notFound.fromReq(req);
    let assPath = Database.assignments.toObject(ass).code_location;
    let assJsonStream = await storage.getObject(storage.container, assPath + ".json");

    let chunks = [];
    assJsonStream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    assJsonStream.on("end", () => {
        chunks = Buffer.concat(chunks);
        chunks = chunks.toString("utf-8");
        chunks = JSON.parse(chunks);

        // BUG: Using single quotes in the test->expected will cause the attribute to close early, and therefore not actually show the content!
        // I've come to the sad realisation that we need to encode any textcontent that we get and decode what we send.
        // I don't know if this is somethig that's a problem across all templating engines, though.
        // Ultimately, we need to make a plan on **where** to encode/decode special chars.
        // See implementation: https://stackoverflow.com/a/4835406/2238442

        res.render("assignments/create", {
            courses: courses,
            assign: JSON.stringify(chunks, (key, value) => {
                if(typeof value === "string") {
                    return value.replace(/\n/g, "\\n").replace(/\"/g, '\\"');
                }
                return value;
            }),
            assignObj: chunks
        });
    });
});
router.post("/assignments/create", async (req, res) => {
    let save = await saveAssignment(req, res, req.body);
    if(!!save.id && !save.err) {
        res.status(201).json({
            success: true,
            id: save.id,
            redirect: "/assignments/edit/" + save.id,
            message: "Assignment created successfully!"
        });
    } else {
        res.status(save.err?.code ?? 500).json({
            success: false,
            id: save.id || null,
            message: save.err?.message ?? "Something went wrong!"
        });
    }
});
router.put("/assignments/edit/:id", async (req, res) => {
    let save = await saveAssignment(req, res, req.body, req.params.id);
    if(!!save.err) {
        save.err.code = save.err.code ?? 500;
        save.err.message = save.err.message ?? "Something went wrong!";
    }
    res.status(save.err?.code ?? 200).json({
        success: !save.err,
        id: save.id,
        message: save.err?.message ?? "Assignment updated successfully!"
    });
});

/**
 * Called when the teacher uploads a bulk of assignments.
 * 
 * This function does a lot of stuff all in one:
 * - Compiles the java files to .class files
 * - Creates a Jar Archive of the .class files and a manifest (see `/app/jenv/java.js`)
 * - Deletes all .java and .class files that are lingering
 * - Starts a runner for each assignment
 * 
 * // MAYBE: This function should probably be separated into smaller functions
 * 
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').OutgoingMessage} res 
 */
async function onStudentAssignmentsUploaded(req, res) {
    if(req.files.length === 0) throw errors.badRequest.fromReq(req);

    let ws = websocket.registerNewSocket(`#${req.params.id}`, `/assignments/socket/${req.params.id}`);
    let marker = createMarker(ws, req.params.id);
    marker.then((m) => {
        m.setState("receiving");

        // Respond here so we can tell the user what's going on
        if(!res.headersSent) res.status(202).json({
            socketLink: ws.path,
        });
    }).catch((err) => {
        throw errors.internalServerError.fromReq(req, err.message);
    });

    // FIXME: Uncomment this when the time is right!
    // Database.assignments.updateAssignment(req.params.id, {
    //     "state": "processing"
    // });

    // Creates an array of just dirs (should all be student dirs)
    let inboundFiles = req.files.reduce((acc, cur) => {
        let curDir = path.dirname(cur.path);
        if(!acc.includes(curDir)) acc.push(curDir);
        return acc;
    }, []);
    // This runs the compiler across all those dirs - compiling every file and deleting residuals
    inboundFiles = inboundFiles.map(folder => {
        return (() => {
            // Compile all files in the dir
            function onError(err) {
                err.code = 500;
                err.message = err.stdout;
                console.log("INBOUND FILES ERROR");
                console.error(err);
                throw err;
            }
            return Promise.resolve().then(async () => {
                return {
                    "student": path.basename(folder),
                    "dir": folder,
                    "compileResponse": await java.promise.compile(folder)
                };
            }).then(async (response) => {
                // delete everything that IS a ".java" file
                // Don't worry about this not being awaited - we want it to run in the background
                await Promise.all(fs.readdirSync(folder).filter(f => f.endsWith(".java")).map(f => fs.promises.unlink(path.join(folder, f))));
                return {
                    ...response,
                    "unlink": {
                        "java": true
                    }
                };
            }).then(async response => {
                // build jar from leftover files -- idk if this is even uselful
                return {
                    ...response,
                    "jarResponse": await java.promise.buildJar(path.join(folder, path.basename(folder) + ".jar")).catch(onError)
                };
            }).then(async (response) => {
                await Promise.all(fs.readdirSync(folder).filter(f => f.endsWith(".class")).map(f => fs.promises.unlink(path.join(folder, f))));
                response.unlink.class = true;
                response.success = response.compileResponse.code === 0 && response.jarResponse.code === 0;
                return response;
            }).catch(onError);
        });
    });
    // inboundFiles is now an array of functions that return promises

    const limit = (await plimit).default(7);
    inboundFiles = inboundFiles.map(p => limit(p));
    return Promise.resolve(marker)
        .then((m) => m.setState("compiling"))
        .then(() => Promise.all(inboundFiles))
        .then(async (responses) => {
            let successes = responses.filter(r => r.success).length;
            ws.sendToAll("notify", {message: `Received ${responses.length} files and compiled and created ${successes} jars!`, type: "success"});
            m = await marker;
            m.setStudents(responses.map(r => ({student: r.student, jarFile: path.join(r.dir, r.student + ".jar")})));
            return m.start();
            // Promise.resolve(marker);// responses is now a promise in itself -- it's split so we can make a web socket while compilation happens(m => m.setState("processing"));
        }).catch((err) => {
            console.log("ENDING PROMISE");
            console.error(err);
            throw err;
        });
    // responses is now a promise in itself -- it's split so we can make a web socket while compilation happens
}

async function createMarker(socket, assignmentID) {
    return Database.assignments.getAssignment(assignmentID)
        .then(a => a.assignments_code_location)
        .then(async codeLoc => {
            console.log("CODE LOC");
            let [json, java] = await Promise.all([
                storage.getObject(storage.container, codeLoc + ".json"),
                storage.getObject(storage.container, codeLoc + ".java"),
            ]);
            return [json, java];
        }).then(async ([json, java]) => {
            function readStream(s) {
                return new Promise((resolve, reject) => {
                    let data = "";
                    s.on("data", d => data += d);
                    s.on("end", () => resolve(data));
                    s.on("error", reject);
                });
            }
            return Promise.all([
                readStream(json),
                readStream(java)
            ]);
        }).then(async ([json, java]) => {
            json = JSON.parse(json.toString());
            let javaPath = path.join(__dirname, "..", "jenv", "context", `Assignment${assignmentID}.java`);
            await fs.promises.writeFile(javaPath, java);
            let marker = new MarkerManager(socket, json, javaPath);
            console.log("MARKER");
            return marker;
        });
}

async function saveAssignment(req, res, assignment, assignmentID) {
    if(!!assignment.id) assignmentID = assignment.id;
    if(assignmentID === undefined || assignmentID === null) {
        // get a new assignment id, try save then refresh page.
        // if there's an error, then send the id back, the client
        //     will make sure subsequent requests have the same id.
        assignmentID = (await Database.assignments.addAssignment(assignment.name, assignment.course, devNull)).affectedID;
        // BUG: If something bounces we need to run a cron job to remove all assignments tied to devNull
    } else {
        // Delete the old assignment files
        oldAssignment = (await Database.assignments.getAssignment(assignmentID)).assignments_code_location;
        // oldAssignment = oldAssignment === devNull ? {} : JSON.parse(await storage.getObject(storage.container, oldAssignment + ".json"));

        if(oldAssignment !== null && oldAssignment !== undefined && oldAssignment !== devNull) {
            try {
                await Promise.all([
                    storage.deleteObject(storage.container, oldAssignment + ".json"),
                    storage.deleteObject(storage.container, oldAssignment + ".java"),
                ]).catch(() => {});
            } catch(e) {}
            // suppress errors
        }
    }

    // Quick sanitisation so we don't break anything on the fs
    if(isNaN(assignmentID)) throw errors.badRequest.fromReq(req, "Invalid assignment ID: " + assignmentID);

    assignment.id = assignmentID;
    const filename = `Assignment${assignmentID}`;
    let err = null;

    try {
        let code = generateJavaCode(assignment, assignmentID);
        let filesPath = assignment.course + path.sep + filename;

        let ret = await Database.assignments.updateAssignment(assignmentID, {
            assignment_name: assignment.name,
            course_uuid: assignment.course,
            code_location: filesPath
        });

        // Something happened and the db coundn't update!
        if(!ret) throw errors[e.code ?? 500].fromReq(req, e.message);

        await Promise.all([
            storage.putObject(storage.container, filesPath + ".json", JSON.stringify(assignment, undefined, config.env.isDev ? 2 : undefined)),
            storage.putObject(storage.container, filesPath + ".java", code),
        ]).catch((e) => {
            throw errors[500].fromReq(req, e.message);
        });
    } catch(e) {
        err = e;
        if(!(e instanceof ErrorGeneric)) Object.assign(err, errors[e.code ?? 500].fromReq(req, e.message));
    }

    return {
        id: assignmentID,
        err: err,
    };
}

module.exports = router;