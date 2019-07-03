var dbConnection = require("../database/connect");

/* getForecasts=
call to get number of weeks within which service will be required
returns:
{
    "weeksWithinWhichServicingRequired": 12
}
*/

module.exports.getForecasts = async () => {
  console.log("get forecasts called");

  /* confidenceOfOneCount=
  call to get count of predictions with value of '1'
  returns:
  {
      "metaData": [
        {
            "name": "COUNT(PREDICTEDVALUE)"
        }
    ],
    "rows": [
        {
            "COUNT(PREDICTEDVALUE)": 1204
        }
    ]
  }
  */
  let confidenceOfOneCountResult = await dbConnection.performQuery(
    "select count(PREDICTEDVALUE) from predicted_data where PREDICTIONCONFIDENCE = 1"
  );
  let confidenceOfOneCount = confidenceOfOneCountResult.rows[0]['COUNT(PREDICTEDVALUE)'];

  /* predictionsCount=
  call to get count of predictions
  returns:
  {
    "metaData": [
        {
            "name": "MAX(ROWNUM)"
        }
    ],
    "rows": [
        {
            "MAX(ROWNUM)": 1550
        }
    ]
  }
  */
  let predictionsCountResult = await dbConnection.performQuery(
    "select max(rownum) from predicted_data"
  );
  let predictionsCount = predictionsCountResult.rows[0]['MAX(ROWNUM)'];


  let confidenceRatio = confidenceOfOneCount / predictionsCount;
    
  // how soon does it need to be repaired
  let weeksWithinWhichServicingRequired = 4;

  if (confidenceRatio > 0.8) {
    weeksWithinWhichServicingRequired = 2;
  } else if (confidenceRatio > 0.6) {
    weeksWithinWhichServicingRequired = 4;
  }
  else{
    weeksWithinWhichServicingRequired = 12
  }

  return { weeksWithinWhichServicingRequired };
};
