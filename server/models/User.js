const mongoose = require("mongoose");

//create schema here

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },

  password: {
    type: String,
    required: true,
  },

  memory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memory",
    },
  ],

  image: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

//exporting the model
module.exports = mongoose.model("User", userSchema);
