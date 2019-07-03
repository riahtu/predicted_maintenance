const IdcsAuthnSDK = require("../helpers/IdcsAuthnSDK");
const config = require("../config/config");

module.exports = function LoginApp(payload) {
  console.log("Here: " + payload.initialState);

  this.baseUri = config.oracle.AudienceServiceUrl;
  console.log(this.baseUri);

  this.logMsg = function(msg) {
    console.log("LoginApp: " + msg);
  }; // this.logMsg

  this.mask = function() {
    var propsToMask = [
      "username",
      "password",
      "bypasscode",
      "otpcode",
      "questions",
      "deviceid",
      "requeststate",
      "phonenumber",
      "token",
      "authntoken",
      "trusttoken",
      "userid"
    ];
    var stars = "***";
    var temp;
    try {
      if (data !== Object(data)) {
        temp = JSON.parse(data); // Object deep copy, except methods, that we don't need here.
      } else {
        temp = JSON.parse(JSON.stringify(data)); // Object deep copy, except methods, that we don't need here.
      }
      for (let key in temp) {
        if (temp.hasOwnProperty(key)) {
          if (
            temp[key] !== Object(temp[key]) &&
            propsToMask.indexOf(key.toLowerCase()) !== -1
          ) {
            // key is not a object
            temp[key] = stars;
          } else if (
            Array.isArray(temp[key]) &&
            propsToMask.indexOf(key.toLowerCase()) !== -1
          ) {
            // key is an object array
            temp[key] = stars; // we're simply masking the whole array, don't care about the contents.
          } else {
            // key is simple object
            for (let subkey in temp[key]) {
              if (
                temp[key].hasOwnProperty(subkey) &&
                propsToMask.indexOf(subkey.toLowerCase()) !== -1
              ) {
                temp[key][subkey] = stars;
              }
            }
          }
        }
      }
      return JSON.stringify(temp);
    } catch (e) {
      return stars;
    }
  }; //this.mask

  this.nextOperation = function() {
    this.logdata("nextOperation: " + this.mask(payload));

    if (payload.requestState && payload.initialState.nextOp) {
      this.setRequestState(payload.requestState);

      if (payload.nextOp[0] === "credSubmit") {
        if (payload.nextAuthFactors) {
          if (payload.nextAuthFactors.length > 1) {
            this.displayAltFactorsSubform(payload);
          } else {
            this.displayForm(
              payload.initialStatus.nextAuthFactors[0],
              "submitCreds",
              payload
            );
          }
        } else if (payload.nextOp.indexOf("enrollment") === -1) {
          // Alternative factors case
          let which = Object.keys(self.AuthenticationFactorInfo).filter(
            function(x) {
              return x in payload;
            }
          );
          this.logdata("Factor is " + which[0]);

          if (typeof which[0] === "undefined") {
            // PUSH alternative factor case, when there's no 'PUSH' in the payload.
            if (
              payload.status === "pending" &&
              payload.cause &&
              payload.cause[0].code === "AUTH-1108"
            ) {
              which[0] = "PUSH";
              this.logdata("Setting factor to " + which[0]);
              if (payload.displayName) {
                // displayName is on payload for PUSH only when PUSH is chosen as an alternative method.
                this.logdata(
                  "About to display form for " +
                    which[0] +
                    "[submitCreds] with payload " +
                    this.mask(payload)
                );
                this.displayForm(which[0], "submitCreds", payload);
              } else {
                this.logdata(
                  "Waiting on " +
                    which[0] +
                    "[submitCreds] with payload " +
                    this.mask(payload)
                );
              }
            }
          } else {
            this.logdata(
              "About to display form for " +
                which[0] +
                "[submitCreds] with payload " +
                this.mask(payload)
            );
            this.displayForm(which[0], "submitCreds", payload);
          }
        } else if (
          payload.EMAIL ||
          payload.SECURITY_QUESTIONS ||
          payload.PUSH ||
          payload.TOTP
        ) {
          let which = Object.keys(self.AuthenticationFactorInfo).filter(
            function(x) {
              return x in payload;
            }
          );
          this.logdata("which[0] is " + which[0]);
          this.displayForm(which[0], "enrollment", payload);
        } else if (payload.nextOp[1] === "enrollment") {
          let which = Object.keys(self.AuthenticationFactorInfo).filter(
            function(x) {
              return x in payload;
            }
          );
          this.displayForm(which[0], "enrollment", payload);
        } else if (payload.SMS && payload.SMS.credentials[0] === "otpCode") {
          let which = Object.keys(self.AuthenticationFactorInfo).filter(
            function(x) {
              return x in payload;
            }
          );
          this.logdata("which[0] is " + which[0]);
          this.displayForm(which[0], "enrollment", payload);
        } else {
          this.logdata("Do not know what to do with given payload.");
        }
      } else if (payload.nextOp.indexOf("enrollment") >= 0) {
        if (!payload.nextAuthFactors) {
          this.displayEnrollmentSuccess(payload);
        } else {
          this.displayEnrollmentOptionsForm(payload);
        }
      } else {
        this.logdata("Do not know what to do with given payload.");
      }
    }
  }; // this.nextOperation

  this.getAccessToken = function() {
    return payload.signinAT;
  };

  this.isIDPUserInIDCS = function() {
    return payload.initialState.isIDPUserInIDCS;
  };

  this.getIDPAuthnToken = function() {
    return payload.initialState.IDPAuthnToken;
  };

  this.getSocialData = function() {
    var socialData = {};
    socialData.requestState = this.getRequestState();
    socialData.userData = JSON.parse(payload.initialState.social.scimUserAttrs);
    return socialData;
  };

  this.isSocialRegistrationRequired = function() {
    var isRequired = payload.initialState.social.needToRegister;
    if (isRequired && isRequired === "true") {
      return true;
    } else {
      return false;
    }
  };

  this.removeSocialData = function() {
    sessionStorage.removeItem("social.scimUserAttrs");
    sessionStorage.removeItem("social.needToRegister");
  };

  this.setRequestState = function(rs) {
    // sessionStorage.setItem("requestState", rs);
  };

  this.getRequestState = function() {
    return payload.requestState;
  };

  this.getClientId = function() {
    return payload.clientId;
  };

  this.getInitialState = function() {
    return payload.initialState;
  };

  var self = this;
  this.getOperation = function() {
    return payload.initialState.op;
  };

  this.getToken = function() {
    return decodeURIComponent(payload.initialState.token);
  };

  this.sdk = new IdcsAuthnSDK(this);
  this.sdk.initAuthentication();
}; // function loginApp
