const Site = require("../../../models/site");

const query = async (query) => {
  try {
    return Site.findSafe(query).populate("area");
  } catch (err) {
    console.log("Query Error @ sites - service: ", err);
    throw err;
  }
};

const getById = async (id) => {
  try {
    return Site.findByOid(id).populate("area");
  } catch (err) {
    console.log("getById Error @ sites - service: ", err);
    throw err;
  }
};

const save = async (site) => {
  try {
    return Site.sync(site);
  } catch (err) {
    console.log("Saving Error @ sites - service: ", err);
    throw err;
  }
};

module.exports = {
  query,
  getById,
  save,
};
