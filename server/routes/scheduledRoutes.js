var express = require('express');
var refineryRouter = express.Router();
var db = require('../models/refineries');

refineryRouter.get("/", async (req, res) => {  
  let result = await db.getAllRefineries();
  res.send(result);
});

refineryRouter.get("/:id", async (req, res) => {
  let result = await db.getRefineryById(req.params.id);
  res.send(result);
});

module.exports = refineryRouter;