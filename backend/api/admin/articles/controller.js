const articleService = require("./service");
const logger = require("../../../services/logger.service");

const getArticles = async (req, res) => {
  const articles = await articleService.query(req.query);
  logger.debug(articles);
  res.json(articles);
};

const getArticle = async (req, res) => {
  const article = await articleService.getById(req.params.id);
  logger.debug(article);
  res.json(article);
};

const saveArticle = async (req, res) => {
  const article = req.body;
  await articleService.save(article);
  res.send(article);
};

module.exports = {
  getArticles,
  getArticle,
  saveArticle,
};
