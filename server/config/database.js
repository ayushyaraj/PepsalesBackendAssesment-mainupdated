const mongoose = require("mongoose");

require("dotenv").config(); //to fetch data from .env file

exports.connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DABTABASE CONNECTED SUCCESFULLY"))
    .catch((error) => {
      console.log("UNABLE TO CONNECT TO DB");
      console.error(error);
      process.exit(1);
    });
};
