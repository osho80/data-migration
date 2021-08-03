const singleService = require("./service");
const logger = require("../../../services/logger.service");

const getSingles = async (req, res) => {
  const singles = await singleService.query(req.query);
  logger.debug(singles);
  res.json(singles);
};

const getSingle = async (req, res) => {
  const singleObj = await singleService.getById(req.params.id);
  logger.debug(singleObj);
  res.json(singleObj);
};

const saveSingle = async (req, res) => {
  const single = req.body;
  await singleService.save(single);
  res.send(single);
};

module.exports = {
  getSingles,
  getSingle,
  saveSingle,
};
