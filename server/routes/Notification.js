const express = require("express");
const router = express.Router();
const {
  sendNotification,
  getUserNotifications,
} = require("../controllers/notificationController");

// Send a notification
router.post("/", sendNotification);

// Get notifications for a user
router.get("/users/:id/notifications", getUserNotifications);

module.exports = router;
