const jwt = require("jsonwebtoken"),
  mongoose = require("mongoose"),
  User = require("../models/user"),
  dbUser = require("../models/dbUser"),
  promise = require("request-promise"),
  idcsCrypto = require("./idcsCrypto"),
  oauth = require("./oauth"),
  config = require("../config/config"),
  existingUser = mongoose.model("users");

function redirectBrowser(req, res, url, payload) {
  res.statusCode = 200;

  oauth.getAT().then(function(accessToken) {
    res.setHeader("Content-Type", "text/html");
    res.write('<script language="JavaScript">\n');

    res.write("try {\n");

    // check to make sure session storage isn't disabled:
    res.write(
      'if (!sessionStorage) { console.log("Session storage missing."); throw("No session storage");}\n'
    );
    // then make sure it works:
    res.write("let temp = Math.floor( Math.random() * 10000).toString();\n");
    res.write('sessionStorage.setItem("test", temp);\n');
    res.write('if ( sessionStorage.getItem("test") != temp ) {\n');
    res.write(
      'console.log("Save and read back from session storage failed.");\n'
    );
    res.write('throw("Unable to save in session storage");\n');
    res.write("}\n");

    // clear storage to make sure we're starting from a clean slate
    // We do this to remove the above test but also to deal with the case where
    // a user comes to the login page (and possibly begins working through a login)
    // but then abandons it.
    res.write("sessionStorage.clear();\n");

    // then add the basic fields in:
    res.write('sessionStorage.setItem("signinAT", "' + accessToken + '");\n');
    res.write(
      'sessionStorage.setItem("baseUri", "' +
        config.oracle.AudienceServiceUrl +
        '");\n'
    );
    if (config.oracle.ClientSelfReg) {
      res.write(
        'sessionStorage.setItem("selfRegProfiles", "' +
          config.oracle.ClientSelfReg +
          '");\n'
      );
    }
    res.write(
      'sessionStorage.setItem("clientId",\'' + config.oracle.ClientId + "');\n"
    );

    // then add on everything from the payload
    for (var field in payload) {
      res.write(
        'sessionStorage.setItem("' +
          field +
          "\",'" +
          payload[field].replace(/'/g, "\\'") +
          "');\n"
      );
    }
    // finally send the user to the requested URL
    res.write('window.location = "' + url + '";\n');
    // res.write('document.write("You should be redirected in a moment...");\n');

    // this closes out the try block above
    res.write("}\n");
    res.write("catch(err) {\n");
    // res.write('document.write("Something went wrong.");\n');
    res.write("}\n");

    res.write("</script>\n\n");
    res.end();
  });
}

/**
 * Parse orginal user object to remove sensitive data
 * @param {user}
 * @returns {parsedUser}
 */
const setUserInfo = user => {
  let timestamp = new Date().getTime();

  return {
    id: user._id,
    userName: user.userName,
    tenancyId: user.tenancyId,
    compartmentId: user.compartmentId,
    userId: user.userId,
    keyFingerprint: user.keyFingerprint,
    keyPath: user.keyPath,
    iat: timestamp
  };
};

/**
 * Function used to sign Jwt with secret and apply an expiration
 * @param {user}
 * @returns {signedJwt}
 */
const createToken = user => {
  return jwt.sign(user, config.server.APP_SEC, {
    expiresIn: 60 * 60 * 24
  });
};

/**
 * Function accessed by the "/getuser" route.
 * @param {req, res, next}
 * @returns {userObject}
 */
exports.getToken = async (req, res, next) => {
  let options = {
    uri: config.oracle.AudienceServiceUrl + "/oauth2/v1/introspect",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: config.server.APP_SEC
    },
    form: {
      token: req.user
    }
  };

  const userPromise = await promise
    .post(options)
    .then(res => {
      return JSON.parse(res);
    })
    .catch(error => {
      return false;
    });

  const existingUser = await User.findOne({
    userName: userPromise.sub
  }).catch(error => {
    return null;
  });

  if (!existingUser) {
    return res.redirect("/error");
  }

  let userInfo = setUserInfo(existingUser.toJSON());

  req.user = {
    user: userInfo.userName,
    token: createToken(userInfo)
  };

  next();
};

exports.authUser = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["authorization"] ||
    req.cookies.jwt;

  if (!token) {
    res.status(404).send({
      error: "Unauthorized: No token provided"
    });
  } else {
    jwt.verify(token, config.server.APP_SEC, function(err, user) {
      if (err) {
        res.status(404).send({
          error: "Unauthorized: Invalid token"
        });
      } else {
        console.log(user);
        req.user = user;
        next();
      }
    });
  }
};

exports.register = (req, res, next) => {
  const userName = req.body.userName;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  // If email or password are null, "422 Error" will be returned
  if (!userName || !firstName || !lastName) {
    return res.status(422).send({
      error: "Must enter all fields."
    });
  }

  // If email is not found, user will be saved, otherwise, an error will populate.
  existingUser.findOne(
    {
      userName: userName
    },
    (error, existingUser) => {
      if (error) {
        return next(error);
      }

      if (existingUser) {
        return res.status(422).send({
          error: "Username is in use."
        });
      }

      const newUser = new User({
        userName: req.body.userName,
        name: {
          givenName: req.body.firstName,
          familyName: req.body.lastName
        },
        emails: {
          value: req.body.userName
        },
        displayName: req.body.firstName + " " + req.body.lastName
      });

      const options = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + req.body.token
        },
        body: newUser,
        json: true
      };

      promise(
        "https://idcs-22b20c4bf753492fa6ebac4738804c80.identity.oraclecloud.com/ui/v1/api/registerMe/",
        options,
        (req, res)
      )
        .then(data => {
          res
            .status(200)
            .send({ message: "Check your email to verify your account!" });
        })
        .then(data => {
          if (data) {
            let dbUser = new dbUser({
              userName: req.body.userName,
              tenancyId: "",
              compartmentId: "",
              userId: "",
              keyFingerpringt: "",
              keyPath: ""
            });
          }
        })
        .catch(error => {
          console.log(error);
          res.send(error);
        });

      newUser.save(error => {
        return error;
      });

      // On user save, either an error, or a new token will be returned.
      // user.save(error => {
      //   return error ?
      //     next(error) :
      //     res
      //     .cookie("token", createToken(existingUser), {
      //       httpOnly: true
      //     })
      //     .sendStatus(200);
      // });
    }
  );
};

exports.idcsAuth = (req, res, next) => {
  if (req.body.authnToken) {
    redirectBrowser(req, res, "/login", {
      IDPAuthnToken: req.body.authnToken
    });
  } else if (req.body.loginCtx && req.body.signature) {
    let encrypted = req.body.loginCtx;
    let decrypted = idcsCrypto.decrypt(encrypted);
    let loginContext = JSON.parse(decrypted);

    idcsCrypto.verifySignature(
      "loginCtx",
      req.body.loginCtx,
      req.body.signature
    );
    if (!loginContext.requestState) {
      res.statusCode = 500;
      res.end("Login context does not contain request state.");
    } else {
      redirectBrowser(req, res, "/login", {
        initialState: JSON.stringify(loginContext),
        requestState: loginContext.requestState
      });
    }
  }
};

exports.sessionToken = async (req, res, next) => {
  console.log(req.body);
  let options = {
    method: "POST",
    uri: config.oracle.AudienceServiceUrl + "/oauth2/v1/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: config.server.APP_SEC
    },
    body: "grant_type=authorization_code&code=" + req.body.code,
    json: true
  };

  const tokenPromise = await promise
    .post(options)
    .then(response => {
      return response.id_token;
    })
    .catch(error => {
      console.log(error);
      // res.redirect("/error");
    });
  req.user = tokenPromise;
  next();
};
