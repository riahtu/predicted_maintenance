// Working async/await code for single row query
// var dbConnection = require('../database/connect')

// module.exports.getAllSensorData = async () => {
//   console.log('get all sensor data called');
//   return await dbConnection.performQuery('SELECT * FROM(SELECT * FROM livesensorstatus ORDER BY DATE_OF_ENTRY DESC) WHERE ROWNUM = 1');
// }

// the following code was built off the example from 
// https://jsao.io/2017/06/how-to-get-use-and-close-a-db-connection-using-promises/


const oracledb = require('oracledb');
var config = require('../config/config');

let connectConfig = {
  user : config.adw.user,
  password : config.adw.password,
  connectString : config.adw.connectString
};
let queryOptions = {
  outFormat: oracledb.OBJECT
};

function queryExecute (connection, partName, queryOptions) {
  //query with a bind parameter of :part specified to be passed in with the bind parameters object in connection.execute
  let query = "SELECT * FROM(SELECT * FROM livesensorstatus ORDER BY DATE_OF_ENTRY DESC ) WHERE ROWNUM = 1 and PART = :part";
  let bindParameters = { part: partName }
  let queryPromise = connection.execute(query, bindParameters, queryOptions);
  return queryPromise;
}

// query the database for the most recent row of sensor data for each part
// currently the output is an object with each part name as the key and 
// sensor data as its value eg.
// {
//   "filter": {
//     "IID": 43,
//     "PART": "Filter",
//     "TEMPRATURE": 320,
//     "ROOMTEMPRATURE": 213,
//     "VIBRATIONKCPM": 34,
//     "HUMIDITY": 23,
//     "VOLTAGE": 32,
//     "RPM": 23,
//     "PSI": 54,
//     "THROUGHPUTPCT": 56,
//     "DATE_OF_ENTRY": "2019-06-06T23:44:50.000Z",
//     "HRSSINCELASTSTART": 65,
//     "HRSCUM": 87,
//     "CALIBRATIONSINCELASTSERVICE": 34,
//     "HRSSINCELASTMAINTENANCE": 45,
//     "MONTHSTONEXTSERVICE": 64,
//     "STATUSFROMSERVICE": "3-Fair",
//     "TIMESSERVICED": 2,
//     "WORKINGOUTPUTCHANNELS": 56,
//     "REMAININGFUEL": null
//    },
// }
function getAllSensorData() {
  return new Promise(function(resolve, reject) {
    let conn; // Declared here for scoping purposes.
 
    oracledb
      .getConnection(connectConfig)
      .then(function(c) {
        console.log('Connected to database');
 
        conn = c;
 
        let parts = ['Filter', 'Boiler', 'Pump', 'Desalter', 'Reflux Drum', 'Generator'];

        let queryPromises = parts.map(part => queryExecute(conn, part, queryOptions));
        
        return Promise.all(queryPromises);
      })
      .then(
        function(result) {
          console.log('Query executed');

          //grab just the first row data from each query response since we just want
          // the most recent row for each part
          result = result.map(queryRespose => queryRespose.rows[0])
          
          // transform the array of objects into an object with each parts values
          // stored under a key of that parts name, the object here is written
          // with the part names as keys since we know what those are ahead 
          // of time as they are used to make the queries
          result = result.reduce((accumulator, current) => {
            accumulator[current.PART.toLowerCase()] = current;
            return accumulator;
          }, {
            filter: {},
            boiler: {},
            pump: {},
            desalter: {},
            'reflux drum': {},
            generator: {},
          });

          resolve(result);
        },
        function(err) {
          console.log('Error occurred', err);
 
          reject(err);
        }
      )
      .then(function() {
        if (conn) {
          // If conn assignment worked, need to close.
          return conn.close();
        }
      })
      .then(function() {
        console.log('Connection closed');
      })
      .catch(function(err) {
        // If error during close, just log.
        console.log('Error closing connection', err);
      });
  });
}
 
module.exports.getAllSensorData = getAllSensorData;