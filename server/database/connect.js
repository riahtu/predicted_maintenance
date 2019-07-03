var oracledb = require('oracledb');
var config = require('../config/config');

async function performQuery(query, bindParameters = {}) {

  let connection;
  let result;
  let connectConfig = {
    user : config.adw.user,
    password : config.adw.password,
    connectString : config.adw.connectString
  };
  let queryOptions = {
    outFormat: oracledb.OBJECT
  };

  try {
    connection = await oracledb.getConnection(connectConfig);
    // result = await connection.execute(query, bindParameters);
    result = await connection.execute(query, bindParameters, queryOptions);
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
  return result;
};

module.exports.performQuery = performQuery;