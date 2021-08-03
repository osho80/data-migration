// require aws.js
const aws = require("./storage/aws");

const BUCKET_NAME = "mesangelim";

const getOldFile = async (path) => {
  const params = {
    Key: `old_mesangelim/${path}`,
    Bucket: BUCKET_NAME,
  };
  return await aws.getFile(params);
};

const getTrack = async (path) => {
  const params = {
    Key: `tracks/${path}`,
    Bucket: BUCKET_NAME,
  };
  return await aws.getFile(params);
};

const getImage = async (path) => {
  const params = {
    Key: `images/${path}`,
    Bucket: BUCKET_NAME,
  };
  return await aws.getFile(params);
};

const saveTrack = async (Id, fileType, data) => {
  const params = {
    Key: `tracks/${Id}_${Date.now()}.${fileType}`,
    Bucket: BUCKET_NAME,
    Body: data,
  };
  return await aws.saveFile(params);
};

const saveImage = async (Id, fileType, data) => {
  const params = {
    Key: `images/${Id}_${Date.now()}.${fileType}`,
    Bucket: BUCKET_NAME,
    Body: data,
  };
  return await aws.saveFile(params);
};

module.exports = {
  getOldFile,
  getTrack,
  getImage,
  saveTrack,
  saveImage,
};

// const getData = async (params) => {
//   delete params.Body;
//   const data = await new Promise((resolve, reject) => {
//     const myData = aws.getObject(params, function (err, data) {
//       // was aws.s3
//       if (err) {
//         console.log("Error while getting file: ", err, "params:", params);
//         reject(err);
//       } else {
//         resolve(data.Body);
//       }
//     });
//     return myData;
//   });
//   return data;
// };

// const uploadFile = async (params) => {
//   const newUrl = await new Promise((resolve, reject) => {
//     const myData = aws.upload(params, function (err, data) {
//       // was aws.s3
//       if (err) {
//         console.log("Error while saving file: ", err);
//         reject(err);
//       } else {
//         resolve(data.Location);
//       }
//     });
//     return myData;
//   });
//   return newUrl;
// };
