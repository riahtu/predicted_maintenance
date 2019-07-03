import IdcsSelfRegSDK from "./IdcsSelfRegSDK";
import { signUpUri } from "./config";

export default function RegisterApp() {
  /* RegisterApp is a copied and modified LoginApp for purpose of Self Registration
   * Construct is pretty much like LoginApp.
   * This does following :
   * Displays Self Reg Form
   * Displays Self Reg Success Form
   * Gets Application Context Error (when applicable)
   */

  this.logMsg = function(msg) {
    if (window.console && this.debugEnabled) {
      console.log("LoginApp: " + msg);
    }
  }; // this.logMsg
  this.baseUri = signUpUri;
  this.selfRegProfiles = sessionStorage.getItem("selfRegProfiles");
  this.registrationProfiles = ["MantaSelfReg"];
  this.mask = function(msg) {
    let propsToMask = ["username", "password", "userid", "emails.value"];
    var stars = "***";
    var temp;
    try {
      if (msg !== Object(msg)) {
        temp = JSON.parse(msg); // Object deep copy, except methods, that we don't need here.
      } else {
        temp = JSON.parse(JSON.stringify(msg)); // Object deep copy, except methods, that we don't need here.
      }
      for (var key in temp) {
        if (temp.hasOwnProperty(key)) {
          if (
            temp[key] !== Object(temp[key]) &&
            propsToMask.indexOf(key.toLowerCase()) != -1
          ) {
            // key is not a object
            temp[key] = stars;
          } else if (
            Array.isArray(temp[key]) &&
            propsToMask.indexOf(key.toLowerCase()) != -1
          ) {
            // key is an object array
            temp[key] = stars; // we're simply masking the whole array, don't care about the contents.
          } else {
            // key is simple object
            for (var subkey in temp[key]) {
              if (
                temp[key].hasOwnProperty(subkey) &&
                propsToMask.indexOf(subkey.toLowerCase()) != -1
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

  this.getAccessToken = function() {
    return sessionStorage.getItem("signinAT");
  };

  this.selfregSDK = new IdcsSelfRegSDK(this);
  this.selfregSDK.initSelfregSDK();

  if (
    sessionStorage.getItem("operation") &&
    sessionStorage.getItem("operation") === "register"
  ) {
    this.selfregSDK.validateUser(
      decodeURIComponent(sessionStorage.getItem("token"))
    );
  } else {
    this.selfregSDK.loadSelfRegProfiles();
  }
} // function loginApp
