const router = require("express").Router();
const generate = require("../assets/js/generateReports");

/* **************************** */
/*      PAGES FOR REPORTS       */
/* **************************** */

router.use("/reports/*", (req, res, next) => {
    res.locals.pageTitle = "Reports";
    next();
});

router.get("/reports/:id", async (req, res) => {
    let info = {
        assignmentID: req.params.id
    };

    let filePath = `A${info.assignmentID}/total`;

    let report = await generate.pullTotalCSV(info);

    let url = {
        csv: await storage.presignedGetUrl(storage.container, `${filePath}.csv`)
    };

    res.render("reports/assignment", {
        report,
        url,
    });
});

router.get("/reports/:id/:student", async (req, res) => {
    let info = {
        studentID: req.params.student,
        assignmentID: req.params.id
    };

    let filePath = `A${info.assignmentID}/${info.studentID}/${info.studentID}`;

    let url = {
        csv: await storage.presignedGetUrl(storage.container, `${filePath}.csv`)
    };

    let report = await generate.pullCSV(info);

    res.render("reports/student", {
        info,
        report,
        url,
    });
});

module.exports = router;