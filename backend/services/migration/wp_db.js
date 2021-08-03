const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "mesangelim_wp",
  password: "Mesangelim18",
  database: "mesangelim_wordpress",
});

async function mysqlQuery(queryString) {
  const res = () =>
    new Promise((resolve, reject) => {
      connection.query(queryString, function (err, res, fields) {
        if (err) {
          console.log("Query Error:", err);
          reject(err);
        }
        resolve(res);
      });
    });
  const queryRes = await res();
  return queryRes;
}

module.exports = {
  mysqlQuery,
};
