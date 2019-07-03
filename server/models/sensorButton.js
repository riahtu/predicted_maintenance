var dbConnection = require("../database/connect");

module.exports.getsensorbutton = async () => {
  console.log("get button colors called");
  return await dbConnection.performQuery(
    "select PART,count(PREDICTEDVALUE) as cout from predicted_data group by PART"
  );
};
