const router = require("express").Router();

// router.use(require("./publicUrls"));
router.use(require("./public"));
router.use(require("./account"));
router.use(require("./admin"));
router.use(require("./assignment"));
router.use(require("./fileManager"));

module.exports = router;