const mongoose = require("mongoose");

require("dotenv").config();

const connect = async () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      process.env.MONGO_HOST,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      function (err, db) {
        if (err) {
          console.log("connected to db - error: ", err);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const init = async () => {
  console.log("mongoose connect", process.env.MONGO_HOST);
  await connect();
  mongoose.set("useFindAndModify", false);
};

const createSchema = (childSchema) => {
  const schema = new mongoose.Schema({
    ...childSchema,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  });

  schema.statics.sync = function (doc) {
    return doc._id
      ? this.updateOne({ _id: doc._id }, { ...doc, updated: new Date() })
      : this.create(doc);
  };

  schema.statics.findSafe = function (query) {
    return this.find({ ...query, deleted: false });
  };

  schema.statics.findOneSafe = function (query) {
    return this.findOne({ ...query, deleted: false });
  };

  schema.statics.findByOid = function (id) {
    return this.findById({
      _id: mongoose.Types.ObjectId(id),
    });
  };

  schema.statics.findByName = function (name) {
    return this.findOneSafe({ name });
  };

  return schema;
};

module.exports = {
  init,
  createSchema,
};
