const express = require("express");
const router = express.Router();
const { getSites, getSite, saveSite } = require("./controller");

router.get("/", getSites);
router.get("/:id", getSite);
router.put("/", saveSite);

module.exports = router;
