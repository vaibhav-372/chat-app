const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connection
mongoose
  .connect("mongodb://localhost:27017/chat-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Set expires to 5 minutes (300 seconds)
  },
  {}
);
const OTP = mongoose.model("login-otp", otpSchema);

const registerDataSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  otp: String,
});
const register = mongoose.model("registerData", registerDataSchema);

// Generate a 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Nodemailer configuration for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bloggy372@gmail.com",
    pass: "azby ctkh jlnv fcrt",
  },
});

// Function to send OTP
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: "bloggy372@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
    html: `<b">Your OTP code is ${otp}</b>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Send OTP endpoint
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  // Generate OTP
  const otp = generateOTP();

  const existMail = await register.findOne({ email });

  if (existMail) {

    res.status(400).json({ message: "Email already exists" });

  } else {
  
    // Save OTP to the database
    const otpEntry = new OTP({ email, otp });
    try {
      await otpEntry.save();
      await sendOTP(email, otp);

      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error saving OTP or sending email:", error);
      res
        .status(500)
        .json({ message: "Failed to send OTP . Please try again later." });
    }
  }
});

// Verify OTP endpoint
app.post("/verify-otp", async (req, res) => {
  const { email, name, password, otp } = req.body;
  try {
    const otpEntry = await OTP.findOne({ email, otp });

    if (otpEntry) {
      // Save registration data
      const registerEntry = new register({ email, name, password, otp });
      await registerEntry.save();

      console.log(
        `name: ${name}, password: ${password},email: ${email}, otp: ${otp}`
      );

      res.status(200).json({
        message: "OTP verified and registration completed successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error); // More detailed logging
    res
      .status(500)
      .json({ message: "Failed to verify OTP. Please try again later." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
