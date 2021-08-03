const Area = require("../../../models/area");

const query = async (query) => {
  try {
    return Area.findSafe(query);
  } catch (err) {
    console.log("Query Error @ areas - service: ", err);
    throw err;
  }
};

const getById = async (id) => {
  try {
    return Area.findByOid(id);
  } catch (err) {
    console.log("getById Error @ areas - service: ", err);
    throw err;
  }
};

const save = async (area) => {
  try {
    return Area.sync(area);
  } catch (err) {
    console.log("Saving Error @ areas - service: ", err);
    throw err;
  }
};

module.exports = {
  query,
  getById,
  save,
};
