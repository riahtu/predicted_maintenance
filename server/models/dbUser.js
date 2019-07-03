const mongoose = require("mongoose");
const { Schema } = mongoose;

// Basic user model
const dbUserSchema = new Schema({
  userName: {
    type: "String"
  },
  tenancyId: {
    type: "String"
  },
  compartmentId: {
    type: "String"
  },
  userId: {
    type: "String"
  },
  keyFingerpringt: {
    type: "String"
  },
  keyPath: {
    type: "String"
  }
});

const dbUser = mongoose.model("dbUsers", dbUserSchema);

module.exports = dbUser;
