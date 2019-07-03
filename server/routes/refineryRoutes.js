var express = require("express");
var refineryRouter = express.Router();
var db = require("../models/refineries");

var organizeSchedsByRefinery = schedRowsArray => {
  return schedRowsArray.reduce((accumulator, current) => {
    let refineryId = current.REFINERYID;
    let serviceName = current.SERVICENAME;
    let scheduledDttm = current.SCHEDULEDDTTM;

    refineryId in accumulator || (accumulator[refineryId] = {});
    accumulator[refineryId][serviceName] = scheduledDttm;
    return accumulator;
  }, {});
};

var addSchedsToRefineries = (refineriesArray, schedsArray) => {
  return refineriesArray.map(refinery => {
    refinery.serviceDate = schedsArray[refinery.REID].Service;
    refinery.maintenanceDate = schedsArray[refinery.REID].Maintenance;
    return refinery;
  });
};

refineryRouter.get("/", async (req, res) => {
  let refineriesResult = await db.getAllRefineries();
  let scheduleResults = await db.getAllSchedStatus();
  let schedByRefinery = organizeSchedsByRefinery(scheduleResults.rows);
  let refineriesWithSched = addSchedsToRefineries(
    refineriesResult.rows,
    schedByRefinery
  );
  res.send(refineriesWithSched);
});

refineryRouter.get("/:id", async (req, res) => {
  let result = await db.getRefineryById(req.params.id);
  res.send(result);
});

module.exports = refineryRouter;
