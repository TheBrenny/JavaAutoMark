const express = require('express');
const router = express.Router();
const storage = require("../../storage/storage");
const errors = require("./errors/generic").errors;

router.get("/download/*", async (req, res, next) => {
    let path = req.path.substring("/download/".length);

    try {
        const stream = await storage.getObject(storage.container, path);
        stream.on("end", () => res.end());
        stream.pipe(res);
    } catch (err) {
        throw err; // errors[404].fromReq(req);
    }
});

router.put("/upload/*", express.raw({
    limit: "5mb"
}), async (req, res) => {
    let path = req.path.substring("/upload/".length);

    try {
        await storage.putObject(storage.container, path, req.body);
        res.send("done").end();
    } catch (err) {
        throw err; //errors[404].fromReq(req);
    }
});

module.exports = router;