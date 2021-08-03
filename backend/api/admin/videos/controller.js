const videoService = require("./service");
const logger = require("../../../services/logger.service");

const getVideos = async (req, res) => {
  const videos = await videoService.query(req.query);
  logger.debug(videos);
  res.json(videos);
};

const getVideo = async (req, res) => {
  const video = await videoService.getById(req.params.id);
  logger.debug(video);
  res.json(video);
};

const saveVideo = async (req, res) => {
  const video = req.body;
  await videoService.save(video);
  res.send(video);
};

module.exports = {
  getVideos,
  getVideo,
  saveVideo,
};
