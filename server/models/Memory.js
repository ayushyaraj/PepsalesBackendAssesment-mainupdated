const mongoose = require("mongoose");

//create schema here

const SubSectionSchema = mongoose.Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },

  videoUrl: {
    type: String,
  },
  images: {
    type: String,
  },

  additionalUrl: {
    type: String,
  },
});

//exporting the model
module.exports = mongoose.model("subSection", SubSectionSchema);
