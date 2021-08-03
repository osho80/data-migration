const areas = require("./areas");
const sites = require("./sites");
const singles = require("./singles");
const articles = require("./articles");
const videos = require("./videos");

const migrate = async () => {
  const newAreas = await areas.migrate();
  console.log("Areas migrated successfuly");
  const newSites = await sites.migrate(newAreas);
  console.log("Sites migrated successfuly");
  const newSingles = await singles.migrate(newSites);
  console.log("Singles migrated successfuly");
  const newArticles = await articles.migrate();
  console.log("Articles migrated successfuly");
  const newVideos = await videos.migrate();
  console.log("Videos migrated successfuly");
  console.log("Migartion completed successfuly");
};

module.exports = {
  migrate,
};
