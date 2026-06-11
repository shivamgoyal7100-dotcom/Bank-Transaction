# Nodemailer Setup Guide

This document provides a complete guide to the nodemailer email setup in the Bank Transaction application.

## Project Structure

```
src/
├── config/
│   └── mail.js              # Nodemailer transporter configuration
├── services/
│   └── mail.service.js      # Core email sending service
├── utils/
│   ├── sendMail.js          # Ready-to-use email utilities
│   └── mail.templates.js    # HTML email templates
├── controllers/
│   └── auth.controller.js   # Integrated with email sending
└── routes/
    └── auth.routes.js
```

## Files Created

### 1. `src/config/mail.js`
- **Purpose:** Configure nodemailer transporter
- **Features:**
  - Gmail/SMTP configuration
  - Connection verification
  - Service-agnostic (can switch providers)

### 2. `src/services/mail.service.js`
- **Purpose:** Core email sending functionality
- **Functions:**
  - `sendEmail(email, subject, html)` - Send basic email
  - `sendEmailWithAttachments(email, subject, html, attachments)` - Send with files

### 3. `src/utils/sendMail.js`
- **Purpose:** High-level email utilities for common use cases
- **Functions:**
  - `sendWelcomeEmail()` - Welcome new users
  - `sendPasswordResetEmail()` - Password reset requests
  - `sendEmailVerification()` - Email verification
  - `sendTransactionAlert()` - Transaction notifications
  - `sendCustomEmail()` - Send custom emails
  - `sendBulkEmail()` - Send to multiple recipients

### 4. `src/utils/mail.templates.js`
- **Purpose:** HTML email templates
- **Templates:**
  - Welcome email
  - Password reset
  - Email verification
  - Transaction alerts

## Environment Configuration

### Setup Instructions

1. **Copy `.env.example` to `.env`:**
   ```bash
   cp .env.example .env
   ```

2. **Configure Email Service (Gmail Example):**

   #### Option A: Gmail with App Password (Recommended)
   ```
   MAIL_SERVICE=gmail
   MAIL_USER=your_email@gmail.com
   MAIL_PASSWORD=your_16_char_app_password
   ```

   Steps:
   - Enable 2-Factor Authentication on your Google account
   - Go to Google Account > Security > App passwords
   - Select "Mail" and "Windows Computer"
   - Generate a 16-character app password
   - Use this password in `.env`

   #### Option B: Other Email Services
   ```
   MAIL_SERVICE=outlook
   MAIL_USER=your_email@outlook.com
   MAIL_PASSWORD=your_password
   ```

   Supported services: gmail, outlook, yahoo, aol, etc.

3. **Set Other Variables:**
   ```
   MAIL_FROM=noreply@yourdomain.com
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your_secret_key
   MONGO_URI=your_mongodb_connection
   ```

## Usage Examples

### 1. Send Welcome Email (After Registration)

```javascript
const { sendWelcomeEmail } = require("../utils/sendMail");

// In your registration controller
await sendWelcomeEmail(userEmail, userName);
```

### 2. Send Password Reset Email

```javascript
const { sendPasswordResetEmail } = require("../utils/sendMail");

// Generate reset token (JWT)
const resetToken = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1 hour" }
);

// Send email
await sendPasswordResetEmail(userEmail, userName, resetToken);
```

### 3. Send Email Verification

```javascript
const { sendEmailVerification } = require("../utils/sendMail");

const verifyToken = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "24 hours" }
);

await sendEmailVerification(userEmail, userName, verifyToken);
```

### 4. Send Transaction Alert

```javascript
const { sendTransactionAlert } = require("../utils/sendMail");

const transaction = {
  amount: "$500.00",
  type: "Withdrawal",
  date: new Date().toLocaleString(),
  reference: "TXN123456",
  status: "Completed",
};

await sendTransactionAlert(userEmail, userName, transaction);
```

### 5. Send Custom Email

```javascript
const { sendCustomEmail } = require("../utils/sendMail");

const customHtml = `
  <h1>Custom Message</h1>
  <p>Your custom email content here</p>
`;

await sendCustomEmail(userEmail, "Custom Subject", customHtml);
```

### 6. Send Bulk Emails

```javascript
const { sendBulkEmail } = require("../utils/sendMail");

const emails = ["user1@email.com", "user2@email.com", "user3@email.com"];
const html = "<h1>Notification</h1>";

await sendBulkEmail(emails, "Subject", html);
```

## Integration with Auth Controller

The `auth.controller.example.js` shows how to integrate email sending:

```javascript
// After successful registration
sendWelcomeEmail(email, name).then((result) => {
  if (result.success) {
    console.log("Welcome email sent");
  } else {
    console.log("Failed to send email:", result.error);
  }
});
```

## Email Templates Customization

All templates in `src/utils/mail.templates.js` can be customized:

1. Edit the HTML in the template functions
2. Add your logo/branding
3. Customize colors and styling
4. Add/remove sections as needed

Example:
```javascript
function welcomeEmailTemplate(name, email) {
  return `
    <html>
      <!-- Your custom HTML here -->
    </html>
  `;
}
```

## Troubleshooting

### Email Not Sending
1. Check `MAIL_USER` and `MAIL_PASSWORD` are correct
2. Enable "Less secure app access" for Gmail (if not using App Password)
3. Check internet connection
4. Review console logs for errors

### Gmail Issues
- Make sure you use App Password, not regular password
- Enable 2FA on your Google account
- Check if the app password is exactly 16 characters

### SMTP Authentication Failed
- Verify credentials in `.env`
- Check if MAIL_SERVICE is correct
- Try with a different email provider

## Security Best Practices

1. ✅ Never commit `.env` file to version control
2. ✅ Use environment variables for sensitive data
3. ✅ Use App Passwords instead of account passwords
4. ✅ Validate email addresses before sending
5. ✅ Add rate limiting to prevent email bombing
6. ✅ Log all email activities
7. ✅ Handle errors gracefully

## Advanced Features

### Custom Transporter Configuration

If you need more control, modify `src/config/mail.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
```

### Add Email Attachments

```javascript
const { sendEmailWithAttachments } = require("../services/mail.service");

const attachments = [
  {
    filename: "invoice.pdf",
    path: "/path/to/invoice.pdf",
  },
];

await sendEmailWithAttachments(
  email,
  "Your Invoice",
  html,
  attachments
);
```

## Next Steps

1. Update `.env` with your email credentials
2. Test with `sendWelcomeEmail()` in your registration endpoint
3. Add rate limiting middleware to email endpoints
4. Monitor email delivery rates
5. Customize templates with your branding
6. Add email history tracking in MongoDB

## Support

For issues with nodemailer, visit: https://nodemailer.com/
For Gmail App Passwords: https://support.google.com/accounts/answer/185833
