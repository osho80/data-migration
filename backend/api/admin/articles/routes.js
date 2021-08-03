const express = require("express");
const router = express.Router();
const { getArticles, getArticle, saveArticle } = require("./controller");

router.get("/", getArticles);
router.get("/:id", getArticle);
router.put("/", saveArticle);

module.exports = router;
