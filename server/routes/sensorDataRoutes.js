var express = require("express");
var sensorRouter = express.Router();
var dbSensor = require("../models/sensors");
var dbForecast = require("../models/forecasts");
var dbSensorStatus = require("../models/sensorStatus");
var dbrulstatus = require("../models/rulStatus");
var dbbuttoncolor = require("../models/sensorButton");

sensorRouter.get("/", async (req, res) => {
  let sensorDataResult = await dbSensor.getAllSensorData();
  res.send(sensorDataResult);
});

sensorRouter.get("/forecasts", async (req, res) => {
  let forecastDataResult = await dbForecast.getForecasts();
  res.send(forecastDataResult);
});

sensorRouter.get("/status", async (req, res) => {
  let sensorStatus = await dbSensorStatus.getSensorStatus();
  res.send(sensorStatus);
});

sensorRouter.get("/rul", async (req, res) => {
  let sensorStatus = await dbrulstatus.getrulstatus();
  res.send(sensorStatus);
});

sensorRouter.get("/sensorbutton", async (req, res) => {
  let sensorStatus = await dbbuttoncolor.getsensorbutton();
  res.send(sensorStatus);
});

module.exports = sensorRouter;
