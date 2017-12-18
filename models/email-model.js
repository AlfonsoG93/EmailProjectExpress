const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const emailSchema = new Schema(
  {
    emailAddress: {
      type: String,
      match: [/.+@.+/, 'Emails need to have @" sign '],
      required:[true, 'Email is required']
    },

    firstName: {
      type: String,
    },

    lastName: {
      type: String
    },

    phoneNumber: {
      type: String
    }
  },
  {
    timestamps:true
  }
);

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
