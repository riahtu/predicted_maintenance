var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection(  {
      user : dbConfig.user,
      password : dbConfig.password,
      connectString : dbConfig.connectString
    });
    // Query for the Service
    //update LiveScheduleStatus set scheduledDTTM = '21-MAY-19' where (servicename = 'Maintenance' and refineryid = 1);


    // Refinery 1
    console.log('#####################################');

    let refinery1 = await connection.execute(
      `SELECT * FROM REFINERIES WHERE reid = 1`  
    );

    let schrefinery1 = await connection.execute(
      `SELECT * FROM LiveScheduleStatus WHERE refineryid = 1`  
    );

    var name1 = refinery1.rows[0][1];
    console.log(refinery1.rows[0][1]);

    var city1 = refinery1.rows[0][2];
    console.log(refinery1.rows[0][2]);

    var state1 = refinery1.rows[0][3];
    console.log(refinery1.rows[0][3]);
    
    var serviced1 = schrefinery1.rows[0][2];
    console.log(schrefinery1.rows[0][2]);

    var maintenanced1 = schrefinery1.rows[1][2];
    console.log(schrefinery1.rows[1][2]);

    // Refinery 2
    console.log('#####################################');

    let refinery2 = await connection.execute(
      `SELECT * FROM REFINERIES WHERE reid = 2`  
    );

    let schrefinery2 = await connection.execute(
      `SELECT * FROM LiveScheduleStatus WHERE refineryid = 2`  
    );
    var name2 = refinery2.rows[0][1];
    console.log(refinery2.rows[0][1]);

    var city2 = refinery2.rows[0][2];
    console.log(refinery2.rows[0][2]);

    var state2 = refinery2.rows[0][3];
    console.log(refinery2.rows[0][3]);

    var serviced2 = schrefinery2.rows[0][2];
    console.log(schrefinery2.rows[0][2]);

    var maintenanced2 = schrefinery2.rows[1][2];
    console.log(schrefinery2.rows[1][2]);

    // Refinery 3
    console.log('#####################################');

    let refinery3 = await connection.execute(
      `SELECT * FROM REFINERIES WHERE reid = 3`  
    );

    let schrefinery3 = await connection.execute(
      `SELECT * FROM LiveScheduleStatus WHERE refineryid = 3`  
    );

    var name3 = refinery3.rows[0][1];
    console.log(refinery3.rows[0][1]);

    var city3 = refinery3.rows[0][2];
    console.log(refinery3.rows[0][2]);

    var state3 = refinery3.rows[0][3];
    console.log(refinery3.rows[0][3]);

    var serviced3 = schrefinery3.rows[0][2];
    console.log(schrefinery3.rows[0][2]);

    var maintenanced3 = schrefinery3.rows[1][2];
    console.log(schrefinery3.rows[1][2]);

    // Refinery 4
    console.log('#####################################');

    let refinery4 = await connection.execute(
      `SELECT * FROM REFINERIES WHERE reid = 4`  
    );

    let schrefinery4 = await connection.execute(
      `SELECT * FROM LiveScheduleStatus WHERE refineryid = 4`  
    );

    var name4 = refinery4.rows[0][1];
    console.log(refinery4.rows[0][1]);

    var city4 = refinery4.rows[0][2];
    console.log(refinery4.rows[0][2]);

    var state4 = refinery4.rows[0][3];
    console.log(refinery4.rows[0][3]);

    var serviced4 = schrefinery4.rows[0][2];
    console.log(schrefinery4.rows[0][2]);

    var maintenanced4 = schrefinery4.rows[1][2];
    console.log(schrefinery4.rows[1][2]);

    // Refinery 5
    console.log('#####################################');

    let refinery5 = await connection.execute(
      `SELECT * FROM REFINERIES WHERE reid = 5`  
    );

    let schrefinery5 = await connection.execute(
      `SELECT * FROM LiveScheduleStatus WHERE refineryid = 5`  
    );

    var name5 = refinery5.rows[0][1];
    console.log(refinery5.rows[0][1]);

    var city5 = refinery5.rows[0][2];
    console.log(refinery5.rows[0][2]);

    var state5 = refinery5.rows[0][3];
    console.log(refinery5.rows[0][3]);

    var serviced5 = schrefinery5.rows[0][2];
    console.log(schrefinery5.rows[0][2]);

    var maintenanced5 = schrefinery5.rows[1][2];
    console.log(schrefinery5.rows[1][2]);

    // Refinery 6
    console.log('#####################################');
    let refinery6 = await connection.execute(
      `SELECT * FROM REFINERIES WHERE reid = 6`  
    );

    let schrefinery6 = await connection.execute(
      `SELECT * FROM LiveScheduleStatus WHERE refineryid = 6`  
    );

    var name6 = refinery6.rows[0][1];
    console.log(refinery6.rows[0][1]);

    var city6 = refinery6.rows[0][2];
    console.log(refinery6.rows[0][2]);

    var state6 = refinery6.rows[0][3];
    console.log(refinery6.rows[0][3]);

    var serviced6 = schrefinery6.rows[0][2];
    console.log(schrefinery6.rows[0][2]);

    var maintenanced6 = schrefinery6.rows[1][2];
    console.log(schrefinery6.rows[1][2]);


  
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
}

run();