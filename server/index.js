const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const memoryRoutes = require("./routes/Memory");
const notificationRoutes = require("./routes/Notification");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middleware add

app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

//cloudinary connect()
cloudinaryConnect();

//routes mount
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/memory", memoryRoutes);
app.use("/api/v1/notifications", notificationRoutes);

//default route

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "your server is up and running",
  });
});

//activate the server

app.listen(PORT, () => {
  console.log(`Server is runing at PORT:${PORT}`);
});
