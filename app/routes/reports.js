const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;
const { assignments } = require("../../db/database");
const { task } = require("gulp");
const generate = require("../assets/js/generateReports");

/* **************************** */
/*      PAGES FOR REPORTS       */
/* **************************** */

router.use("/reports/*", (req, res, next) => {
    res.locals.pageTitle = "Reports";
    next();
});

//Make reports/:id/:student

//Shift to reports /:id
router.get("/reports/assignment", async (req, res) => {
    report = makeReport(r);
    // console.log(report.tasks[0].tests);

    res.render("reports/assignment", {
        report
    });
});

router.get("/reports/:id/:student", async (req, res) => {
    let info = {
        studentID: req.params.student,
        assignmentID: req.params.id
    }

    let report = await generate.pullCSV(info);
    console.log(report);
    res.render("reports/student", {
        report
    });
});

function makeReport(resultSet) {
    
    let report = {
        title: "",

        totalStudents: 0,

        minMark: null,
        maxMark: null,

        possibleMarks: 0,
        actualMarks: 0,
        averageMarks: 0,

        tasks: [

        ]
    }

    resultSet.forEach(s => {
        report.title = s.assignmentTitle;
        report.totalStudents++;
        //Possible marks always the same, actual marks add up for average
        report.possibleMarks = s.possibleMarks;
        report.actualMarks += s.actualMarks;
        report.averageMarks = report.actualMarks / report.totalStudents;

        //Check max and min for evaluation
        if(report.minMark == null || s.actualMarks < report.minMark)
            report.minMark = s.actualMarks;

        if(report.maxMark == null || s.actualMarks > report.maxMark)
            report.maxMark = s.actualMarks;

        //Handle each task in each student report
        s.tasks.forEach((t, index, arr) => {

            //If we have less tasks than the result set, add a new task
            if(report.tasks.length < s.tasks.length) {
                report.tasks.push({
                    taskID: 0,
                    possibleMarks: 0,
                    actualMarks: null,
                    averageMarks: 0,
                    tests: []
                })
            }
            report.tasks[index].taskID = t.taskID;
            report.tasks[index].possibleMarks = t.possibleMarks;
            report.tasks[index].actualMarks === null ? report.tasks[index].actualMarks = t.actualMarks : report.tasks[index].actualMarks += t.actualMarks;
            report.tasks[index].averageMarks = report.tasks[index].actualMarks / report.totalStudents;;
        
            t.tests.forEach((test, testIndex, arr) => {
                if(report.tasks[index].tests.length < t.tests.length) {
                    report.tasks[index].tests.push({
                        testID: 0,
                        description: "",
                        condition: "",
                        expected: "",
                        passed: 0,
                        possibleMarks: 0,
                        actualMarks: null,
                        averageMarks: 0
                    })
                }

                report.tasks[index].tests[testIndex]["testID"] = test.testID;
                report.tasks[index].tests[testIndex]["description"] = test.description;
                report.tasks[index].tests[testIndex]["condition"] = test.condition;
                report.tasks[index].tests[testIndex]["expected"] = test.expected;
                test.actualMarks > 0 ? report.tasks[index].tests[testIndex].passed++ : report.tasks[index].tests[testIndex].passed;
                report.tasks[index].tests[testIndex]["possibleMarks"] = test.possibleMarks;
                report.tasks[index].tests[testIndex]["actualMarks"] === null ? report.tasks[index].tests[testIndex].actualMarks = test.actualMarks : report.tasks[index].tests[testIndex].actualMarks += test.actualMarks;
                report.tasks[index].tests[testIndex]["averageMarks"] = report.tasks[index].tests[testIndex].actualMarks / report.totalStudents;
            });
        });

    });

    return report;
}

module.exports = router;