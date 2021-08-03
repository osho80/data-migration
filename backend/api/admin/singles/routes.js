const express = require("express");
const router = express.Router();
const { getSingles, getSingle, saveSingle } = require("./controller");

router.get("/", getSingles);
router.get("/:id", getSingle);
router.put("/", saveSingle);

module.exports = router;
