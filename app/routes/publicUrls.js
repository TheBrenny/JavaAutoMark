const router = require("express").Router();
const checks = require("./tools/checks");
const Database = require("../../db/database");
const storage = require("../../storage/storage");
const session = require("./tools/session");
const bodyParser = require("body-parser");
const errors = require("./errors/generic").errors;

router.get("/download/:id", async (req, res, next) => {
    let id = req.params.id;

    // if id isn't available for download:
    let blob = (await Database.publicUrls.getUrlFromToken("get", id));

    if (blob == undefined) {
        // FIXME: This isn't redirecting to the 404 as expected!!
        throw errors[404].fromReq(req);
    } else {
        let stream = await storage.getObject("", blob.public_urls_path);
        stream.on("end", () => res.end());
        stream.pipe(res);
    }
});

router.put("/upload/:id", bodyParser.raw({
    limit: "5mb"
}), async (req, res) => {
    let id = req.params.id;
    let token = await Database.publicUrls.getUrlFromToken("put", id);

    if (token == undefined) {
        throw ({
            code: 404,
            name: "Not Found",
            message: `Could not ${req.method.toUpperCase()} ${req.url}`
        });
    } else {
        let prom = await storage.putObject("", token.public_urls_path, req.body);
        res.send("done").end();
    }
});

router.get("/getUploadLink/*", checks.isAuthed, async (req, res) => {
    let path = req.path.substring("/getUploadLink/".length);
    let token = await storage.presignedPutUrl("", path);
    res.json({
        token
    });
});

router.get("/getDownloadLink/*", async (req, res) => {
    let path = req.path.substring("/getUploadLink/".length);

});

module.exports = router;