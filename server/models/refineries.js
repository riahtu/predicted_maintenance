var dbConnection = require('../database/connect')

module.exports.getAllRefineries = async () => {
  console.log('get all refineries called');
  return await dbConnection.performQuery('SELECT * FROM REFINERIES');
}

module.exports.getRefineryById = async id => {
  console.log(`get refinery by id called with id: ${id}`);
  return await dbConnection.performQuery(
    'SELECT * FROM REFINERIES WHERE reid = :reid',
    { reid: id }
  );
}

module.exports.getAllSchedStatus = async () => {
  console.log('get all schedStatus called');
  return await dbConnection.performQuery(
    'SELECT * FROM LiveScheduleStatus'
  )
}

module.exports.schedStatusById = async id => {
    console.log(`get schedStatusById called with id ${id}`);
    return await dbConnection.performQuery(
      'SELECT * FROM LiveScheduleStatus WHERE refineryid = :reid',
        { reid: id }
    )
  }

  

