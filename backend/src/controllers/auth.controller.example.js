const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/sendMail");

/**
 * User Registration Controller
 * Sends welcome email after successful registration
 */
async function userRegistrationController(req, res) {
  const { email, password, name } = req.body;

  try {
    const isExists = await userModel.findOne({
      email: email,
    });

    if (isExists) {
      return res.status(422).json({
        message: "Email already exist",
        status: "failed",
      });
    }

    const user = await userModel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3 days",
    });

    res.cookie("token", token);

    // Send welcome email asynchronously
    sendWelcomeEmail(email, name).then((result) => {
      if (result.success) {
        console.log("Welcome email sent to:", email);
      } else {
        console.log("Failed to send welcome email:", result.error);
      }
    });

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
      message: "Registration successful. Welcome email sent.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      status: "failed",
    });
  }
}

/**
 * User Login Controller
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        status: "failed",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
        status: "failed",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3 days",
    });

    res.cookie("token", token);

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
      status: "failed",
    });
  }
}

module.exports = {
  userRegistrationController,
  userLoginController,
};
