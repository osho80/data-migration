const Single = require("../../../models/single");
const storage = require("../../../services/storage");
const tj = require("@mapbox/togeojson");
const DOMParser = require("xmldom").DOMParser;

const query = async (query) => {
  try {
    return Single.findSafe(query).populate("site");
  } catch (err) {
    console.log("Query Error @ singles - service: ", err);
    throw err;
  }
};

const getSingleFromDb = (id) =>
  new Promise((resolve, reject) => {
    try {
      resolve(Single.findByOid(id).populate("site"));
    } catch (err) {
      console.log("getSingleFromDb Error @ singles - service", err);
      reject(err);
    }
  });

const save = async (single) => {
  try {
    return Single.sync(single);
  } catch (err) {
    console.log("Saving Error @ singles - service: ", err);
    throw err;
  }
};

const getTrackPath = (trackUrl) => {
  const tracks = "tracks/";
  const startIdx = trackUrl.indexOf(tracks) + tracks.length;
  return trackUrl.slice(startIdx);
};

const getSingleTrack = async (trackUrl) => {
  try {
    const data = await storage.getTrack(getTrackPath(trackUrl));
    const kml = new DOMParser().parseFromString(data.toString("utf-8"));
    // const converted = tj.kml(kml);
    return tj.kml(kml, { styles: true });
  } catch (err) {
    console.log("Error while getting track @ singles - service:", err);
    throw err;
  }
};

const getById = async (id) => {
  const single = await getSingleFromDb(id);
  const track = await getSingleTrack(single.trackUrl);
  return { single, track };
};

module.exports = {
  query,
  getById,
  save,
};
