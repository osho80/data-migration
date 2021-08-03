const siteService = require("./service");
const logger = require("../../../services/logger.service");

const getSites = async (req, res) => {
  const sites = await siteService.query(req.query);
  logger.debug(sites);
  res.json(sites);
};

const getSite = async (req, res) => {
  const site = await siteService.getById(req.params.id);
  logger.debug(site);
  res.json(site);
};

const saveSite = async (req, res) => {
  const site = req.body;
  await siteService.save(site);
  res.send(site);
};

module.exports = {
  getSites,
  getSite,
  saveSite,
};
