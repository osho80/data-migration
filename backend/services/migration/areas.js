const wp_db = require("./wp_db");
const Area = require("../../models/area");

const getIdsFromOldDb = async () => {
  const oldAreaIds = await wp_db.mysqlQuery(
    "SELECT * FROM wp_term_taxonomy WHERE taxonomy = 'directory-category' AND parent = 0"
  );
  const areaIds = oldAreaIds.map((area) => area.term_id);
  return areaIds;
};

const getAreasFromOldDb = async (areaIds) => {
  const oldAreasNameAndId = await wp_db.mysqlQuery(
    `SELECT name, term_id FROM wp_terms WHERE term_id IN (${areaIds.toString()})`
  );
  const areasNameAndId = oldAreasNameAndId.map((area) => {
    return { name: area.name, term_id: area.term_id };
  });
  return areasNameAndId;
};

const saveAreasInNewDb = async (oldAreas) => {
  return Promise.all(
    oldAreas.map(async (area) => {
      const newArea = new Area({
        name: area.name,
      });
      try {
        return {
          termId: area.term_id,
          area: await newArea.save(),
        };
      } catch (err) {
        console.log("Saving Area Error:", err);
      }
    })
  );
};

const migrate = async () => {
  const oldAreaIds = await getIdsFromOldDb();
  const oldAreas = await getAreasFromOldDb(oldAreaIds);
  const newAreas = await saveAreasInNewDb(oldAreas);

  return newAreas;
};

module.exports = {
  migrate,
};
