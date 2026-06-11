const transporter = require("../config/mail");

/**
 * Send email using nodemailer
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {Promise} - Returns promise with send result
 */
async function sendEmail(email, subject, html) {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: email,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
}

/**
 * Send email with attachments
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @param {Array} attachments - Array of attachment objects
 * @returns {Promise} - Returns promise with send result
 */
async function sendEmailWithAttachments(email, subject, html, attachments = []) {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: email,
      subject: subject,
      html: html,
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email with attachments sent successfully:", info.response);
    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email with attachments:", error);
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
}

module.exports = {
  sendEmail,
  sendEmailWithAttachments,
};
