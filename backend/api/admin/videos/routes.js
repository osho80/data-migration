const express = require("express");
const router = express.Router();
const { getVideos, getVideo, saveVideo } = require("./controller");

router.get("/", getVideos);
router.get("/:id", getVideo);
router.put("/", saveVideo);

module.exports = router;
