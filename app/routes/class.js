const router = require("express").Router();
const checks = require("./tools/checks");
const session = require("./tools/session");
const crypto = require("bcrypt");
const Database = require("../../db/database");
const errors = require("./errors/generic").errors;

router.get("/classes/view", async (req, res) => {
    throw errors[501].fromReq(req);
});

router.get("/classes/view/:id", async (req, res) => {
    throw errors[501].fromReq(req);
});

router.get("/classes/create", async (req, res) => {
    throw errors[501].fromReq(req);
});

router.get("/classes/edit/:id", async (req, res) => {
    throw errors[501].fromReq(req);
});

module.exports = router;