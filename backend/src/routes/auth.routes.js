const express = require("express");
const authController = require("../controllers/auth.controller")
const { sendWelcomeEmail } = require("../utils/sendMail");

const router = express.Router();

// Test email endpoint
router.get("/test-email", async (req, res) => {
  try {
    const result = await sendWelcomeEmail("shivamgoyal7100@gmail.com", "Test User");
    res.json({
      message: "Test email attempt",
      result: result
    });
  } catch (error) {
    res.json({
      error: error.message,
      stack: error.stack
    });
  }
});

router.post("/register",authController.userRegistrationController )
router.post("/login",authController.userLoginController )
router.post("/logout",authController.userLogoutController )
module.exports=router;