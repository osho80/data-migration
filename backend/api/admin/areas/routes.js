const express = require("express");
const { getAreas, getArea, saveArea } = require("./controller");
const router = express.Router();

router.get("/", getAreas);
router.get("/:id", getArea);
router.put("/:id", saveArea);

module.exports = router;
