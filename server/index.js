const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const session = require("express-session");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const config = require("./config/config");

// connecting to our mongodoDB in mLab
mongoose.connect(
  config.server.MONGO_URI,
  //this removes the error we will get from mongoose (error on mongoose end -> wait for mongoose to update)
  { useNewUrlParser: true }
);

// Server setup
const app = express();

// Static file serving
app.use('/', express.static(path.join(__dirname, 'assets')));

// Middleware Setup
app.use("/error", express.static(path.join(__dirname, "/routes/404")));
app.use("*", cors());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(
  session({
    secret: config.server.APP_SEC,
    saveUninitialized: true,
    resave: true
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
require("./services/passport");
app.use(require("./routes"));

const server = http.createServer(app);
// Tell server to listen to the defined port
server.listen(config.server.APP_DEFAULT_PORT || 5000);
console.log("Server started on: Port " + config.server.APP_DEFAULT_PORT);
