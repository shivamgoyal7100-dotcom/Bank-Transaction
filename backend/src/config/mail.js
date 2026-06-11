const nodemailer = require("nodemailer");

// Create a transporter object using Gmail or other email service
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  // For Gmail, use App Password instead of regular password
  // Enable 2FA and create an App Password
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Mail service error:", error);
  } else {
    console.log("Mail service is ready to send emails");
  }
});

module.exports = transporter;
