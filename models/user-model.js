const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    username: {
      type: String,
      required: [true, "Username is required"]
    },
    encryptedPassword: {
      type: String,
      required:[true, " Encrypted password is empty"]
    },
    role: {
      type : String,
      enum:['normal','admin'],
      default: 'admin'

    }

  },

  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
