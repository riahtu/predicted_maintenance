var express = require("express");
var router = express.Router();
const passport = require("passport");
const authRouter = require("./authRoutes");
const refineryRouter = require("./refineryRoutes");
const scheduledRouter = require("./scheduledRoutes");
const sensorData = require("./sensorDataRoutes");

router.use("/", authRouter);
router.use("/refs", refineryRouter);
router.use("/scheduled", scheduledRouter);
router.use("/sensordata", sensorData);
router.use("/api", passport.authenticate("jwt"));

module.exports = router;
