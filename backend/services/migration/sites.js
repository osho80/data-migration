const wp_db = require("./wp_db");
const Site = require("../../models/site");

const getIdsAndDescriptionFromOldDb = async (areaIds) => {
  const oldSitesData = await wp_db.mysqlQuery(
    `SELECT term_id, description, parent FROM wp_term_taxonomy WHERE parent IN (${areaIds.toString()}) AND taxonomy = 'directory-category'`
  );
  const oldSitesIdsAndDescription = oldSitesData.map((site) => {
    return {
      siteId: site.term_id,
      description: site.description,
      area: site.parent,
    };
  });
  return oldSitesIdsAndDescription;
};

const getOldSiteNames = async (siteIds) => {
  const oldSitesIdAndName = await wp_db.mysqlQuery(
    `SELECT name, term_id FROM wp_terms WHERE term_id IN(${siteIds.toString()})`
  );
  const siteNames = oldSitesIdAndName.map((site) => {
    return { siteId: site.term_id, name: site.name };
  });
  return siteNames;
};

const saveSitesInNewDb = async (sitesToSave) => {
  return Promise.all(
    sitesToSave.map(async (site) => {
      const newSite = new Site({
        name: site.name,
        description: site.description,
        area: site.area,
      });
      try {
        return {
          siteId: site.siteId,
          site: await newSite.save(),
        };
      } catch (err) {
        console.log("Saving Site Error:", err);
      }
    })
  );
};

const migrate = async (newAreas) => {
  const areaIds = newAreas.map((area) => area.termId);
  const oldSitesIdsAndDescription = await getIdsAndDescriptionFromOldDb(
    areaIds
  );
  const siteIds = oldSitesIdsAndDescription.map((site) => site.siteId);
  const siteNames = await getOldSiteNames(siteIds);
  const oldSites = oldSitesIdsAndDescription.map((site) => {
    const name = siteNames.find((v) => v.siteId === site.siteId).name;
    return { ...site, name };
  });
  const sitesToSave = oldSites.map((site) => {
    const siteArea = newAreas.find((area) => area.termId === site.area);
    return { ...site, area: siteArea.area };
  });
  const saveSites = await saveSitesInNewDb(sitesToSave);
  return saveSites;
};

module.exports = {
  migrate,
};
