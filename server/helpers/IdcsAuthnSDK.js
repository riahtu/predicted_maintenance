const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports = function IdcsAuthnSDK(app) {
  this.app = app;
  this.initAuthentication = function() {
    console.log("[IdcsAuthnSDK] Init authentication...");
    if (!this.app.getAccessToken) {
      console.log("Failed to acquire.");
    }
    //ResetPassword does not need initial state
    else if (this.app.getOperation() === "resetpwd") {
      console.log("Password Reset Flow..");
      this.validateUserToken(this.app.getToken());
    }
    //user successfully authenticated in external IDP and is already provisioned in IDCS
    else if (this.app.getIDPAuthnToken()) {
      console.log("[IdcsAuthnSDK] inside handover from IDP");
      console.log(
        "[IdcsAuthnSDK] idpauthntoken: " + this.app.getIDPAuthnToken()
      );
      var payload = { authnToken: this.app.getIDPAuthnToken() };
      this.createSession(payload);
    } else {
      console.log(
        "[IdcsAuthnSDK] Initializing authentication with existing initial state from IDCS."
      );
      var initialData = JSON.parse(this.app.getInitialState());
      console.log("HERE YOU GO: " + initialData);
      console.log("[IdcsAuthnSDK] InitialData: " + this.app.getInitialState());
      if (initialData !== null) {
        if (initialData.status === "success") {
          console.log("[IdcsAuthnSDK] status==success");
          console.log(initialData.requestState);
          console.log(initialData.nextOp);
          console.log(initialData.nextAuthFactors);
          if (
            initialData.requestState &&
            initialData.nextOp.indexOf("credSubmit") >= 0 &&
            initialData.nextAuthFactors.indexOf("USERNAME_PASSWORD") >= 0
          ) {
          }
        } else if (initialData.status === "pending") {
          // pending means one of two things:
          if (initialData.cause) {
            if (initialData.cause[0].code) {
              var code = initialData.cause[0].code;

              // then we're waiting for the user to say "Allow"
              // so call back to the app to let them know it's OK to proceed
              if (code === "AUTH-1108") {
                this.app.nextOperation(initialData);
              }
            }
          }
        } else if (initialData.status === "failed") {
          if (
            initialData.nextOp &&
            initialData.nextOp.indexOf("submitCreds") >= 0
          ) {
            // do nothing
            console.log("[IdcsAuthnSDK] Nothing to do here.");
          }
        } else {
          console.log(
            "[IdcsAuthnSDK] Oops, something went wrong when initiating authentication."
          );
          console.log("[IdcsAuthnSDK] Response status: " + initialData.status);
        }
      }
    }
  }; // this.initAuthentication

  this.authenticate = function(data) {
    // console.log('[IdcsAuthnSDK] Authenticating with: ' + this.app.mask(data));
    const self = this;
    let requestData = JSON.stringify({
      nextOp: ["createSession", "createToken"],
      requestState: this.app.getRequestState(data),
      op: "credSubmit",
      credentials: {
        username: data.username,
        password: data.password
      }
    });

    try {
      let jsonData = JSON.parse(requestData); //Verifying input data
      if (
        typeof jsonData.op === "undefined" ||
        typeof jsonData.requestState === "undefined"
      ) {
        console.log("No Operation or Request State defined.");
      }

      var xhr = new XMLHttpRequest();

      xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          try {
            const jsonResponse = JSON.parse(this.responseText);

            if (jsonResponse.status === "success") {
              if (jsonResponse.authnToken) {
                // User is successfully authenticated!
                self.createSession(jsonResponse);
              } else {
                self.app.nextOperation(jsonResponse);
              }
            } else if (jsonResponse.status === "failed") {
              if (jsonResponse.cause) {
                console.log(
                  `{code:${jsonResponse.cause[0].code}, msg:${
                    jsonResponse.cause[0].message
                  }}`
                );
              } else {
                console.log(self.sdkErrors.error9010);
              }

              if (
                jsonResponse.nextOp &&
                jsonResponse.nextOp.indexOf("submitCreds") >= 0
              ) {
                // do nothing
                self.app.logMsg("Nothing to do here.");
              }
            } else if (jsonResponse.status === "pending") {
              // pending means one of two things:
              if (jsonResponse.cause) {
                if (jsonResponse.cause[0].code) {
                  let code = jsonResponse.cause[0].code;

                  // then we're waiting for the user to say "Allow"
                  // so call back to the app to let them know it's OK to proceed
                  if (code === "AUTH-1108") {
                    self.app.nextOperation(jsonResponse);
                  }
                }
              }
            } else {
              console.log(self.sdkErrors.error9011);
            }
          } catch (error) {
            // window.location.replace('http://localhost:3000/error');
          }
        }
      });

      xhr.open("POST", this.app.baseUri + "/sso/v1/sdk/authenticate");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + this.app.getAccessToken()
      );

      xhr.send(requestData);
    } catch (e) {
      //this should never happen
      self.app.logMsg(e);
    }
  }; //this.authenticate

  this.postCreds = function(credentials) {
    console.log("[IdcsAuthnSDK] Posting credentials (u/p)...");

    let data = JSON.stringify({
      op: "credSubmit",
      authFactor: "USERNAME_PASSWORD",
      credentials: credentials,
      requestState: this.app.getRequestState()
    });

    this.authenticate(data);
  }; // this.postCreds

  this.postOtp = function(credentials) {
    console.log("[IdcsAuthnSDK] Posting OTP...");

    var data = JSON.stringify({
      op: "credSubmit",
      credentials: credentials,
      trustedDevice: JSON.parse(this.app.getTrustedDeviceOption()), // Value here MUST be Boolean!!
      trustedDeviceDisplayName:
        this.clientFingerprint.browser +
        " on " +
        this.clientFingerprint.OS +
        " " +
        this.clientFingerprint.OSVersion,
      "this.requestState": this.app.getthis.requestState()
    });

    this.authenticate(data);
  }; // this.postOtp

  this.createToken = function() {
    console.log("[IdcsAuthnSDK] Creating token...");

    var data = JSON.stringify({
      op: "createToken",
      requestState: this.app.getRequestState()
    });

    this.authenticate(data);
  };

  this.validateToken = function(token, callback) {
    console.log("[IdcsAuthnSDK] In Validate Token");

    var data = JSON.stringify({
      token: token,
      schemas: ["urn:ietf:params:scim:schemas:oracle:idcs:UserTokenValidator"]
    });

    var xhr = new XMLHttpRequest();
    const self = this;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        self.app.logMsg(
          "[IdcsAuthnSDK] Validate User Token:" +
            self.app.mask(this.responseText)
        );
        const jsonResponse = JSON.parse(this.responseText);
        callback(jsonResponse);
      }
    });

    xhr.open("POST", app.baseUri + "/admin/v1/UserTokenValidator");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader(
      "Authorization",
      "Bearer " + this.app.getAccessToken()
    );
    xhr.send(data);
  }; // this.validateToken

  this.resetUserPassword = function(token, resetpaswddata, callback) {
    var data = JSON.stringify({
      schemas: ["urn:ietf:params:scim:schemas:oracle:idcs:MePasswordResetter"],
      token: decodeURIComponent(token),
      password: resetpaswddata
    });

    fetch(this.app.baseUri + "/admin/v1/MePasswordResetter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.app.getAccessToken()
      },
      body: data
    }).then(res => {
      console.log(res);
    });
  }; //this.resetUserPassword

  this.createSession = function(payload) {
    console.log("SEssion payload: " + JSON.parse(payload));
    var addParam = function(myform, paramName, paramValue) {
      let param = document.createElement("input");
      param.value = paramValue;
      param.name = paramName;
      param.hidden = true;
      myform.appendChild(param);
    };

    console.log(
      "[IdcsAuthnSDK] Creating session with authnToken:" +
        this.app.mask(payload)
    );

    var myform = document.createElement("form");
    myform.method = "POST";
    myform.action = app.baseUri + "/sso/v1/sdk/session";
    myform.target = "_top";
    addParam(myform, "authnToken", payload.authnToken);
    if (payload.trustToken) {
      console.log("[IdcsAuthnSDK] trustToken added.");
      addParam(myform, "trustToken", payload.trustToken);
    }
    document.body.appendChild(myform);
    //adding this to flush session after successful login...
    sessionStorage.clear();
    myform.submit();
  }; //this.createSession
};
