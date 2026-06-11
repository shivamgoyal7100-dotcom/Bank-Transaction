const { sendEmail, sendEmailWithAttachments } = require("../services/mail.service");
const {
  welcomeEmailTemplate,
  passwordResetEmailTemplate,
  emailVerificationTemplate,
  transactionAlertTemplate,
} = require("./mail.templates");

/**
 * Send welcome email to new user
 * @param {string} email - User's email
 * @param {string} name - User's name
 * @returns {Promise}
 */
async function sendWelcomeEmail(email, name) {
  const subject = "Welcome to Bank Transaction";
  const html = welcomeEmailTemplate(name, email);
  return await sendEmail(email, subject, html);
}

/**
 * Send password reset email
 * @param {string} email - User's email
 * @param {string} name - User's name
 * @param {string} resetToken - Reset token
 * @returns {Promise}
 */
async function sendPasswordResetEmail(email, name, resetToken) {
  const subject = "Password Reset Request - Bank Transaction";
  const html = passwordResetEmailTemplate(name, resetToken);
  return await sendEmail(email, subject, html);
}

/**
 * Send email verification link
 * @param {string} email - User's email
 * @param {string} name - User's name
 * @param {string} verificationToken - Verification token
 * @returns {Promise}
 */
async function sendEmailVerification(email, name, verificationToken) {
  const subject = "Verify Your Email - Bank Transaction";
  const html = emailVerificationTemplate(name, verificationToken);
  return await sendEmail(email, subject, html);
}

/**
 * Send transaction alert email
 * @param {string} email - User's email
 * @param {string} name - User's name
 * @param {object} transaction - Transaction details
 * @returns {Promise}
 */
async function sendTransactionAlert(email, name, transaction) {
  const subject = "Transaction Alert - Bank Transaction";
  const html = transactionAlertTemplate(name, transaction);
  return await sendEmail(email, subject, html);
}

/**
 * Send custom email
 * @param {string} email - Recipient's email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @returns {Promise}
 */
async function sendCustomEmail(email, subject, html) {
  return await sendEmail(email, subject, html);
}

/**
 * Send email to multiple recipients
 * @param {array} emails - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @returns {Promise} - Array of results
 */
async function sendBulkEmail(emails, subject, html) {
  try {
    const results = await Promise.all(
      emails.map((email) => sendEmail(email, subject, html))
    );
    return {
      success: true,
      message: `Emails sent to ${results.length} recipients`,
      results,
    };
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    return {
      success: false,
      message: "Failed to send bulk emails",
      error: error.message,
    };
  }
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendTransactionAlert,
  sendCustomEmail,
  sendBulkEmail,
};
