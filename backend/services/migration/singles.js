const wp_db = require("./wp_db");
const PHPUnserialize = require("php-unserialize");
const storage = require("../storage");
const Single = require("../../models/single");

const getOldSingleIds = async (siteIds) => {
  const singleIds = await wp_db.mysqlQuery(
    `SELECT * FROM wp_term_relationships WHERE term_taxonomy_id IN (${siteIds.toString()})`
  );
  const matchingSingleAndSiteIds = singleIds.map((v) => ({
    singleId: v.object_id,
    siteId: v.term_taxonomy_id,
  }));
  return matchingSingleAndSiteIds;
};

const getInitialSingleData = async (singleIds) => {
  // THIS FUNCTION RETURNS THE SINGLE ID, NAME, CREATED, UPDATED
  const oldSingles = await wp_db.mysqlQuery(
    `SELECT * FROM wp_posts WHERE ID IN (${singleIds.toString()})`
  );
  const singlesInitialData = oldSingles.map((single) => {
    return {
      singleId: single.ID,
      name: single.post_title,
      created: new Date(single.post_date_gmt).getTime(),
      updated: new Date(single.post_modified_gmt).getTime(),
    };
  });
  return singlesInitialData;
};

const getSingleReferenceData = async (singleIds) => {
  // This function collects the references for the remaining data to collect
  const getOldSingleData = await wp_db.mysqlQuery(
    `SELECT * FROM wp_postmeta WHERE post_id IN (${singleIds.toString()})`
  );
  const singleReferences = getOldSingleData.map((singleData) => {
    return {
      singleId: singleData.post_id,
      metaId: singleData.meta_id,
      metaKey: singleData.meta_key,
      metaValue: singleData.meta_value,
    };
  });
  return singleReferences;
};

const createTermsIdsValsMap = async () => {
  const idsValsMap = {};
  const termsObjectRowDataPacket = await wp_db.mysqlQuery(
    `SELECT term_id, name FROM wp_terms`
  );
  for (let i of termsObjectRowDataPacket) {
    idsValsMap[i.term_id.toString()] = i.name;
  }
  return idsValsMap;
};

const metaExtractFunctions = {
  _direct_phyzical_difficulty: (meta, terms) => terms[meta[0]],
  _direct_featured_image: (meta, terms) => meta,
  _direct_map_file: (meta, terms) => Object.entries(meta),
  _direct_single_time: (meta, terms) => terms[meta[0]],
  _direct_description: (meta, terms) => meta,
  _direct_directions: (meta, terms) => meta,
  _direct_single_location: (meta, terms) => meta,
  _direct_difficulty: (meta, terms) => terms[meta[0]],
  _direct_single_type: (meta, terms) => terms[meta[0]],
  _direct_single_shape: (meta, terms) => terms[meta[0]],
};

const extractValue = (metaKey, references, terms) => {
  if (references[metaKey]) {
    return metaExtractFunctions[metaKey](references[metaKey], terms);
  } else {
    return;
  }
};

const constructInitialSingleObject = async (singleIds, singleReferences) => {
  const terms = await createTermsIdsValsMap();
  return singleIds.map((singleId) => {
    const references = {};
    const refs = singleReferences.filter(
      (elementData) => elementData.singleId === singleId
    );
    refs
      .filter((ref) => metaExtractFunctions[ref.metaKey])
      .forEach((ref) => {
        references[ref.metaKey] =
          [
            "_direct_featured_image",
            "_direct_description",
            "_direct_directions",
          ].indexOf(ref.metaKey) === -1
            ? PHPUnserialize.unserialize(ref.metaValue)
            : ref.metaValue;
      });
    return {
      physical_difficulty: extractValue(
        "_direct_phyzical_difficulty",
        references,
        terms
      ),
      img_url: extractValue("_direct_featured_image", references, terms),
      photos: extractValue("_direct_map_file", references, terms),
      time: extractValue("_direct_single_time", references, terms),
      description: extractValue("_direct_description", references, terms),
      directions: extractValue("_direct_directions", references, terms),
      difficulty: extractValue("_direct_difficulty", references, terms),
      type: extractValue("_direct_single_type", references, terms),
      shape: extractValue("_direct_single_shape", references, terms),
      ...extractValue("_direct_single_location", references, terms),
      singleId,
    };
  });
};

const combineSingleData = (initialSingleData, initialSingleObject) => {
  return initialSingleData.map((single) => {
    const matchedSingle = initialSingleObject.find(
      (match) => match.singleId === single.singleId
    );
    return { ...single, ...matchedSingle };
  });
};

const getOldFileByUrl = async (url) => {
  const idx = url.indexOf("2");
  const path = url.slice(idx);
  const type = url.slice(-3);
  const data = await storage.getOldFile(path);
  return { type, data };
};

const getNewUrls = async (combinedSingleData) => {
  return Promise.all(
    combinedSingleData.map(async (single) => {
      const oldTrack = await getOldFileByUrl(single.file_url);
      const trackUrl = await storage.saveTrack(
        single.singleId,
        oldTrack.type,
        oldTrack.data
      );
      const oldImage = await getOldFileByUrl(single.img_url);
      const img_url = await storage.saveImage(
        single.singleId,
        oldImage.type,
        oldImage.data
      );
      try {
        return { ...single, trackUrl, img_url };
      } catch (err) {
        console.log("Error in getting new urls:", err);
      }
    })
  );
};

const getNewGalleryUrls = async (singles) => {
  return Promise.all(
    singles.map(async (single) => {
      const gallery = [];
      if (single.photos) {
        for (let image of single.photos) {
          const oldGalleryImage = await getOldFileByUrl(image[1]);
          const newUrl = await storage.saveImage(
            image[0],
            oldGalleryImage.type,
            oldGalleryImage.data
          );
          gallery.push(newUrl);
        }
      }
      try {
        return { ...single, gallery };
      } catch (err) {
        console.log("Error in getting new gallery urls:", err);
      }
    })
  );
};

const saveSinglesInNewDb = async (singlesWithSiteRef) => {
  return Promise.all(
    singlesWithSiteRef.map(async (single) => {
      const newSingle = new Single({
        name: single.name,
        created: single.created,
        updated: single.updated,
        latitude: single.latitude,
        longitude: single.longitude,
        formatted_address: single.formatted_address,
        trackUrl: single.trackUrl,
        description: single.description,
        difficulty: single.difficulty,
        directions: single.directions,
        gallery: single.gallery,
        imageUrl: single.img_url,
        physical_difficulty: single.physical_difficulty,
        shape: single.shape,
        time: single.time,
        type: single.type,
        site: single.site,
      });
      try {
        return {
          singleId: single.singleId,
          single: await newSingle.save(),
        };
      } catch (err) {
        console.log("Saving Single Error:", err);
      }
    })
  );
};

const migrate = async (newSites) => {
  const siteIds = newSites.map((site) => site.siteId);
  const matchingSingleAndSiteIds = await getOldSingleIds(siteIds);
  //   matchingSingleAndSiteIds: [{singleId, siteId}]

  const singleIds = matchingSingleAndSiteIds.map((v) => v.singleId);

  const initialSingleData = await getInitialSingleData(singleIds);
  // initialSingleData: [{singleId, name, created, updated}]

  const singleReferences = await getSingleReferenceData(singleIds);
  // singleReferences = [{singleId, metaId, metaKey, metaValue}]

  const initialSingleObject = await constructInitialSingleObject(
    singleIds,
    singleReferences
  );

  const combinedSingleData = await combineSingleData(
    initialSingleData,
    initialSingleObject
  );
  const singlesWithNewUrls = await getNewUrls(combinedSingleData);
  console.log("New tracks and images were saved");

  const singlesWithNewGalleryUrls = await getNewGalleryUrls(singlesWithNewUrls);
  console.log("New gallery images were saved");

  const singlesWithSiteId = singlesWithNewGalleryUrls.map((single) => {
    const siteId = matchingSingleAndSiteIds.find(
      (v) => v.singleId === single.singleId
    ).siteId;
    return { ...single, siteId };
  });

  const singlesWithSiteRef = singlesWithSiteId.map((single) => {
    const singleSite = newSites.find((site) => site.siteId === single.siteId);
    return { ...single, site: singleSite.site };
  });

  const saveSingles = await saveSinglesInNewDb(singlesWithSiteRef);

  return saveSingles;
};

module.exports = {
  migrate,
};
