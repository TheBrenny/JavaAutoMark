const router = require("express").Router();
const checks = require("./tools/checks");
const Database = require("../../db/database");
const storage = require("../../storage/storage");
const session = require("./tools/session");

router.get("/download/:id", async (req, res) => {
    let id = req.params.id;

    // if id isn't available for download:
    let blob = (await Database.publicUrls.getUrlFromToken(id));

    if (blob == undefined) {
        // FIXME: This isn't redirecting to the 404 as expected!!
        throw {
            code: 404,
            name: "Not Found",
            message: `Could not ${req.method.toUpperCase()} ${req.url}`
        };
    } else {
        let stream = await storage.getObject("", blob.public_urls_path);
        stream.on("end", () => res.end());
        stream.pipe(res);
    }
});

module.exports = router;