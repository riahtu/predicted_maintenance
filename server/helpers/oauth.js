const request = require("request");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const idcsCrypto = require("./idcsCrypto.js");

let neededScopes = [
  "urn:opc:idm:t.security.client",
  "urn:opc:idm:t.user.signin",
  "urn:opc:idm:t.user.mecreate",
  "urn:opc:idm:t.user.forgotpassword",
  // "urn:opc:idm:t.user.resetpassword",
  "urn:opc:idm:t.user.verifyemail"
];

let necessaryAppRoles = [
  "Authenticated Client",
  "Forgot Password",
  "Reset Password",
  "Self Registration",
  "Signin",
  "Verify Email"
];

// the getAT function goes and gets an AT from IDCS
function getAT() {
  return new Promise(function(resolve, reject) {
    request(
      {
        method: "POST",
        uri: config.oracle.AudienceServiceUrl + "/oauth2/v1/token",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              config.oracle.ClientId + ":" + config.oracle.ClientSecret
            ).toString("base64"),
          Accept: "application/json"
        },

        body:
          "grant_type=client_credentials&scope=" +
          encodeURIComponent(neededScopes.join(" "))
      },
      function(error, response, body) {
        if (response && 200 === response.statusCode) {
          var bodydata = JSON.parse(body);
          let token = bodydata.access_token;
          var decoded = jwt.decode(token);

          let missingScopes = [];
          neededScopes.forEach(function(scope) {
            if (decoded.scope.indexOf(scope) === -1) missingScopes.push(scope);
          });
          if (missingScopes.length > 0) {
            console.log(missingScopes);

            // don't tell the user which is missing. Just that there's a config error.
            // the admin will have to look at the logs to know what they did wrong.
            throw "Unable to continue due to configuration error";
          }

          // if we got here then things are OK
          resolve(token);
        } else {
          console.log(
            "Failed to acquire Access Token. Check client ID, Secret, and IDCS URL."
          );
          // and also for sunspots, or leopards in the server room?
        }
      }
    );
  });
}

exports.getAT = getAT;

const initialized = false;

// We need the signing cert to verify the signature on POST data
// We get the cert from the JWKS URL. But to talk to that we need an AT
// So we wire this function in to be called as soon as we acquire the AT.
//
// In the future we may be able to just use the Client ID and secret.
// Enh 27896624
function getSigningKey(accessToken) {
  return new Promise(function(resolve, reject) {
    request(
      {
        method: "GET",
        uri: config.oracle.AudienceServiceUrl + "/admin/v1/SigningCert/jwk",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + accessToken,
          Accept: "application/json"
        }
      },
      function(error, response, body) {
        if (error)
          if (response && response.statusCode) {
          }

        if (response && 200 === response.statusCode) {
          var bodydata = JSON.parse(body);

          // we need the first (and probably only) cert from there
          if (bodydata.keys && bodydata.keys[0] && bodydata.keys[0].x5c) {
            var x5c = bodydata.keys[0].x5c[0];

            // PEM format says that lines must be no more than 64 chars
            // so rewrap the x5c content 64 bytes at a pop
            var cert = "-----BEGIN CERTIFICATE-----\n";
            while (x5c.length > 0) {
              if (x5c.length > 64) {
                cert += x5c.substring(0, 64) + "\n";
                x5c = x5c.substring(64, x5c.length);
              } else {
                cert += x5c;
                x5c = "";
              }
            }
            cert += "\n-----END CERTIFICATE-----\n";

            idcsCrypto.setTenantCert(cert);
            return;
          }
        }

        // if we get down to here there was a problem.
        // for now we just throw a generic error.
        // since this function is only called during startup throwing here
        // will crash out of the startup and shut the server down.
        // I *think* that's what we want.
        throw "Failed to acquire certificate from JWKS URI!";
      }
    );
  });
}
// only do this once:
if (!initialized) {
  // go get an initial AT not only to check the config, but
  // also to set the tenant ID.
  // We will need that later to decode the post data.

  getAT()
    .then(function(accessToken) {
      // then acquire the tenant signing certificate
      // we should only need to do this once
      getSigningKey(accessToken);

      let decoded = jwt.decode(accessToken);
      if (decoded["user.tenant.name"]) {
        let tenantName = decoded["user.tenant.name"];

        idcsCrypto.setTenantName(tenantName);
      }
    })
    .catch(err => console.error(err));
}
