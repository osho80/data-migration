const wp_db = require("./wp_db");
const Video = require("../../models/video");

const getVideosFromOldDb = async () => {
  return await wp_db.mysqlQuery(
    `SELECT * FROM wp_posts WHERE post_content LIKE '<iframe%' AND post_parent=0`
  );
};

const getVideoUrl = (htmlTag) => {
  const searchStr = 'src="';
  const srcIdx = htmlTag.indexOf(searchStr);
  const srcStart = srcIdx + searchStr.length;
  const endIdx = htmlTag.indexOf('"', srcStart);
  const url = htmlTag.slice(srcStart, endIdx);
  return url;
};

const extractDataFromOldArticles = (videos) => {
  return videos.map((video) => {
    return {
      title: video.post_title,
      created: new Date(video.post_date_gmt).getTime(),
      htmlTag: video.post_content,
      videoUrl: getVideoUrl(video.post_content),
    };
  });
};

const saveVideosInNewDb = async (videosToSave) => {
  return Promise.all(
    videosToSave.map(async (video) => {
      const newVideo = new Video({
        title: video.title,
        videoUrl: video.videoUrl,
        htmlTag: video.htmlTag,
        created: video.created,
      });
      try {
        return await newVideo.save();
      } catch (err) {
        console.log("Saving Video Error:", err);
      }
    })
  );
};

const migrate = async () => {
  const oldVideos = await getVideosFromOldDb();
  // One video does not appear on site - alon test video
  const filteredVideos = oldVideos.filter((video) => video.ID !== 1326);
  const videosToSave = extractDataFromOldArticles(filteredVideos);
  const newVideos = await saveVideosInNewDb(videosToSave);
};

module.exports = {
  migrate,
};
