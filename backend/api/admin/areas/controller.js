const areaService = require("./service");
const logger = require("../../../services/logger.service");

const getAreas = async (req, res) => {
  const areas = await areaService.query(req.query);
  logger.debug(areas);
  res.json(areas);
};

const getArea = async (req, res) => {
  const area = await areaService.getById(req.params.id);
  logger.debug(area);
  res.json(area);
};

const saveArea = async (req, res) => {
  const area = req.body;
  await areaService.save(area);
  res.send(area);
};

module.exports = {
  getAreas,
  getArea,
  saveArea,
};
