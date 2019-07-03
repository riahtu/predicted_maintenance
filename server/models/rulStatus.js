var dbConnection = require("../database/connect");

module.exports.getrulstatus = async () => {
  console.log("get RUL called");
  return await dbConnection.performQuery(
    "SELECT tt.*\
  FROM predicted_rul tt\
  INNER JOIN\
      (SELECT part, MAX(LASTINSPECTIONDATE) AS MaxDateTime\
      FROM predicted_rul\
      GROUP BY part) groupedtt \
  ON tt.part = groupedtt.part \
  AND tt.LASTINSPECTIONDATE = groupedtt.MaxDateTime"
  );
};
