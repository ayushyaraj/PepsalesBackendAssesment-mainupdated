const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // Example: 'smtp.gmail.com'
      port: 587, // For Gmail SMTP (can change based on your provider)
      secure: false, // Use TLS
      auth: {
        user: process.env.MAIL_USER, // Your email address
        pass: process.env.MAIL_PASS, // Your email password / app password
      },
    });

    let info = await transporter.sendMail({
      from: `"Balmukund Kumar" <${process.env.MAIL_USER}>`, // Sender address
      to: `${email}`, // Recipient address
      subject: `${title}`, // Subject line
      html: `${body}`, // HTML body
    });

    // Log the full response for better debugging
    console.log("Email sent successfully: ", info);

    return info; // Return the response object
  } catch (error) {
    // Enhanced error logging
    console.error("Error while sending email:", error.message);
    throw new Error(error.message); // Throw the error so it can be handled
  }
};

module.exports = mailSender;
