const wp_db = require("./wp_db");
const Article = require("../../models/article");

const getArticlesFromOldDb = async () => {
  // const articleIds is hardcoded
  const articleIds = [890, 1006, 1017, 1060];
  return await wp_db.mysqlQuery(
    `SELECT * FROM wp_posts WHERE ID IN (${articleIds.toString()})`
  );
};

const extractDataFromOldArticles = (oldArticles) => {
  return oldArticles.map((article) => {
    if (article.post_status === "publish") {
      return {
        articleId: article.ID,
        parent: article.post_parent,
        created: new Date(article.post_date_gmt).getTime(),
      };
    } else {
      return {
        articleId: article.ID,
        parent: article.post_parent,
        title: article.post_title,
        content: article.post_content,
        updated: new Date(article.post_date_gmt).getTime(),
      };
    }
  });
};

const joinArticleData = (articlesData) => {
  const newArticles = [];
  articlesData.forEach((article) => {
    if (article.parent > 0) {
      const matchedArticle = articlesData.find((match) => {
        return article.parent === match.articleId;
      });
      newArticles.push({ ...matchedArticle, ...article });
    }
  });
  return newArticles;
};

const saveArticlesInNewDb = async (articlesToSave) => {
  return Promise.all(
    articlesToSave.map(async (article) => {
      const newArticle = new Article({
        title: article.title,
        content: article.content,
        created: article.created,
        updated: article.updated,
      });
      try {
        return await newArticle.save();
      } catch (err) {
        console.log("Saving Article Error:", err);
      }
    })
  );
};

const migrate = async () => {
  const oldArticles = await getArticlesFromOldDb();
  const articlesData = extractDataFromOldArticles(oldArticles);
  const combinedArticleData = joinArticleData(articlesData);
  const newArticles = await saveArticlesInNewDb(combinedArticleData);
};

module.exports = {
  migrate,
};
