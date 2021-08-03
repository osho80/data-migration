const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();

const getFile = async (key) => {
  const data = await new Promise((resolve, reject) => {
    const myData = s3.getObject(key, function (err, data) {
      if (err) {
        console.log("Error while getting file: ", err);
        reject(err);
      } else {
        resolve(data.Body);
      }
    });
    return myData;
  });
  return data;
};

const saveFile = async (key) => {
  const newUrl = await new Promise((resolve, reject) => {
    const myData = s3.upload(key, function (err, data) {
      if (err) {
        console.log("Error while saving file: ", err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
    return myData;
  });
  return newUrl;
};

module.exports = {
  getFile,
  saveFile,
};
