const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../notifications/mailTemp/emailVerificationTemplate");

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60, //after 5 minutes the otp will expire
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    );
    if (mailResponse && mailResponse.response) {
      console.log("Email sent successfully: ", mailResponse.response);
    } else {
      console.log("Email sent, but no response was returned.");
    }
  } catch (error) {
    console.log("Error occurred while sending email: ", error.message || error);
    throw error; // Re-throwing the error
  }
}

//pre middleware

otpSchema.pre("save", async function (next) {
  console.log("New document saved to database");
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }

  next();
});

module.exports = mongoose.model("OTP", otpSchema);
