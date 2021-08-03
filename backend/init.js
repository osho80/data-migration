const db = require("./models/db");
const migration = require("./services/migration/migration");

const MIGRATION = false;

const init = async () => {
  await db.init();
  if (MIGRATION) {
    await migration.migrate();
  }
};

module.exports = {
  init,
};
