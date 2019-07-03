var dbConnection = require('../database/connect')

module.exports.getSensorStatus = async () => {
  console.log('get sensor status called');
  let statusResponse = await dbConnection.performQuery(
    'SELECT * FROM(\
      SELECT * FROM livesensorstatus ORDER BY DATE_OF_ENTRY DESC\
    ) \
    WHERE ROWNUM = 1'
  );
  let throughput = statusResponse.rows[0].THROUGHPUTPCT;
  let statusColor = 'red';
  if(throughput > 29 && throughput < 60){
    statusColor = 'yellow';
  } else if(throughput <= 29){
    statusColor = 'green';
  }
  return { statusColor };
}
