const express = require('express');
const router = express.Router();
const checks = require("./tools/checks");
const Database = require("../../db/database");
const storage = require("../../storage/storage");
const session = require("./tools/session");
const errors = require("./errors/generic").errors;

router.get("/download/:id", async (req, res, next) => {
    let id = req.params.id;

    let blob = (await Database.publicUrls.getUrlFromToken("get", id));

    if (blob == undefined) {
        throw errors[404].fromReq(req);
    } else {
        let stream = await storage.getObject(storage.container, blob.public_urls_path);
        stream.on("end", () => res.end());
        stream.pipe(res);
    }
});

router.put("/upload/:id", express.raw({
    limit: "5mb"
}), async (req, res) => {
    let id = req.params.id;
    let token = await Database.publicUrls.getUrlFromToken("put", id);

    if (token == undefined) {
        throw errors[404].fromReq(req);
    } else {
        let prom = await storage.putObject(storage.container, token.public_urls_path, req.body);
        res.send("done").end();
    }
});

router.get("/getUploadLink/*", checks.isAuthed, async (req, res) => {
    let path = req.path.substring("/getUploadLink/".length);
    let token = await storage.presignedPutUrl(storage.container, path);
    res.json({
        token
    });
});

router.get("/getDownloadLink/*", async (req, res) => {
    let path = req.path.substring("/getDownloadLink/".length);
    let token = await storage.presignedGetUrl(storage.container, path);
    res.json({
        token
    });
});

module.exports = router;