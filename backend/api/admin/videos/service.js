const Video = require("../../../models/video");

const query = async (query) => {
  try {
    return Video.findSafe(query);
  } catch (err) {
    console.log("Query Error @ videos - service: ", err);
    throw err;
  }
};

const getById = async (id) => {
  try {
    return Video.findByOid(id);
  } catch (err) {
    console.log("getById Error @ videos - service: ", err);
    throw err;
  }
};

const save = async (video) => {
  try {
    return Video.sync(video);
  } catch (err) {
    console.log("Saving Error @ videos - service: ", err);
    throw err;
  }
};

module.exports = {
  query,
  getById,
  save,
};
