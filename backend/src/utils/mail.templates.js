/**
 * Welcome Email Template
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @returns {string} - HTML template
 */
function welcomeEmailTemplate(name, email) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px 0;
            color: #333;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Bank Transaction</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for registering with us! We're excited to have you on board.</p>
            <p>Your account has been successfully created with the email address: <strong>${email}</strong></p>
            <p>You can now log in and start using our services.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Go to Login</a>
          </div>
          <div class="footer">
            <p>&copy; 2026 Bank Transaction. All rights reserved.</p>
            <p>If you didn't create this account, please contact us immediately.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Password Reset Email Template
 * @param {string} name - User's name
 * @param {string} resetToken - Reset token for password reset
 * @returns {string} - HTML template
 */
function passwordResetEmailTemplate(name, resetToken) {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #dc3545;
            color: #ffffff;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px 0;
            color: #333;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .button {
            display: inline-block;
            background-color: #dc3545;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We received a request to reset your password. Click the button below to reset your password.</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${resetLink}</p>
            <div class="warning">
              <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2026 Bank Transaction. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Email Verification Template
 * @param {string} name - User's name
 * @param {string} verificationToken - Token for email verification
 * @returns {string} - HTML template
 */
function emailVerificationTemplate(name, verificationToken) {
  const verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #28a745;
            color: #ffffff;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px 0;
            color: #333;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .button {
            display: inline-block;
            background-color: #28a745;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for signing up! Please verify your email address by clicking the button below.</p>
            <a href="${verifyLink}" class="button">Verify Email</a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${verifyLink}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Bank Transaction. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Transaction Alert Email Template
 * @param {string} name - User's name
 * @param {object} transaction - Transaction details
 * @returns {string} - HTML template
 */
function transactionAlertTemplate(name, transaction) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #017aff;
            color: #ffffff;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px 0;
            color: #333;
          }
          .transaction-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .transaction-details p {
            margin: 8px 0;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Transaction Alert</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>A new transaction has been detected on your account.</p>
            <div class="transaction-details">
              <p><strong>Amount:</strong> ${transaction.amount || 'N/A'}</p>
              <p><strong>Type:</strong> ${transaction.type || 'N/A'}</p>
              <p><strong>Date:</strong> ${transaction.date || new Date().toLocaleString()}</p>
              <p><strong>Reference:</strong> ${transaction.reference || 'N/A'}</p>
              <p><strong>Status:</strong> ${transaction.status || 'Pending'}</p>
            </div>
            <p>If you did not authorize this transaction, please contact us immediately.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Bank Transaction. All rights reserved.</p>
            <p>For security reasons, never share your account details via email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

module.exports = {
  welcomeEmailTemplate,
  passwordResetEmailTemplate,
  emailVerificationTemplate,
  transactionAlertTemplate,
};
