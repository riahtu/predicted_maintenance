const mongoose = require("mongoose");
const ids = require("../config/config");
const { Schema } = mongoose;

// Basic user model
const userSchema = new Schema({
  active: {
    type: "Boolean",
    default: true
  },
  schemas: {
    type: ["String"],
    default: [
      "urn:ietf:params:scim:schemas:core:2.0:User",
      "urn:ietf:params:scim:schemas:oracle:idcs:extension:selfRegistration:User",
      "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
    ]
  },
  userName: {
    type: "String"
  },
  password: {
    type: "String",
    default: "defaulT123!@#"
  },
  "urn:ietf:params:scim:schemas:oracle:idcs:extension:selfRegistration:User": {
    selfRegistrationProfile: {
      value: {
        type: "String",
        default: "1b6ba95d8dcf4f7b8aeb409fece38eb4"
      },
      type: {
        type: "String",
        default: "SelfRegistrationProfile"
      }
    }
  },
  "urn:ietf:params:scim:schemas:oracle:idcs:extension:user:User": {
    creationMechanism: {
      type: "String",
      default: "idcsui"
    }
  },
  name: {
    givenName: {
      type: "String"
    },
    familyName: {
      type: "String"
    }
  },
  emails: {
    type: [
      {
        value: "String",
        primary: {
          type: "Boolean",
          default: true
        },
        type: {
          type: "String",
          default: "home"
        }
      }
    ]
  },
  displayName: {
    type: "String"
  }
});

const User = mongoose.model("users", userSchema);

module.exports = User;
