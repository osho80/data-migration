const Article = require("../../../models/article");

const query = async (query) => {
  try {
    return Article.findSafe(query);
  } catch (err) {
    console.log("Query Error @ articles - service: ", err);
    throw err;
  }
};

const getById = async (id) => {
  try {
    return Article.findByOid(id);
  } catch (err) {
    console.log("getById Error @ articles - service: ", err);
    throw err;
  }
};

const save = async (article) => {
  console.log("article to save: ", article);
  try {
    return Article.sync(article);
  } catch (err) {
    console.log("Saving Error @ articles - service: ", err);
    throw err;
  }
};

module.exports = {
  query,
  getById,
  save,
};
