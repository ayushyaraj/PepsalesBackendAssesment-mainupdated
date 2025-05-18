const Notification = require("../models/Notification");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const smsSender = require("../utils/smsSender");
const notificationTemplate = require("../notifications/mailTemp/notificationtemp");

// Send a Notification (POST /notifications)
async function sendEmailNotification(email, message) {
  try {
    const htmlContent = notificationTemplate(message); // Use the notification template
    const mailResponse = await mailSender(
      email,
      "New Notification",
      htmlContent
    );
    if (mailResponse && mailResponse.response) {
      console.log("Email sent successfully: ", mailResponse.response);
    } else {
      console.log("Email sent, but no response was returned.");
    }
    return true; // Indicate success
  } catch (error) {
    console.log("Error occurred while sending email: ", error.message || error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    // Validate input
    if (!userId || !type || !message) {
      return res.status(400).json({
        success: false,
        message: "userId, type, and message are required",
      });
    }

    // Validate notification type
    const validTypes = ["Email", "SMS", "In-App"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification type. Must be Email, SMS, or In-App",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create notification in the database
    const notification = await Notification.create({
      userId,
      type,
      message,
      status: "Pending",
    });

    // Handle notification delivery based on type
    let status = "Pending";
    try {
      if (type === "Email") {
        console.log("Sending email to:", user.email);
        console.log("Email subject:", "New Notification");
        console.log("Email message:", message);
        await sendEmailNotification(user.email, message); // Use the new function
        status = "Sent";
      } else if (type === "SMS") {
        if (!user.phoneNumber) {
          throw new Error("User phone number not provided");
        }
        await smsSender({
          phoneNumber: user.phoneNumber,
          message,
        });
        status = "Sent";
      } else if (type === "In-App") {
        // Placeholder for In-App notification (requires frontend implementation)
        console.log(`Sending In-App notification to ${user.email}: ${message}`);
        status = "Sent";
      }
    } catch (error) {
      console.error(`Error sending ${type} notification:`, error);
      status = "Failed";
    }

    notification.status = status;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification processed",
      notification,
    });
  } catch (error) {
    console.error("Error in sendNotification:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing notification",
      error: error.message,
    });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notifications = await Notification.find({ userId: id })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .exec();

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      notifications,
    });
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving notifications",
      error: error.message,
    });
  }
};
