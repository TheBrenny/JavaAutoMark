const router = require("express").Router();

// router.use(require("./publicUrls"));
router.use(require("./public"));
router.use(require("./teachers"));
router.use(require("./reports"));
router.use(require("./assignment"));
router.use(require("./courses"));
router.use(require("./fileManager"));
router.use(require("./admin"));

module.exports = router;