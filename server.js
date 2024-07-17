const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
// const { number } = require("yup");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connection
mongoose
  .connect("mongodb://localhost:27017/chat-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const registerDataSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    otp: String,
    flag: Number,
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
  
  const Register = mongoose.model("registerData", registerDataSchema);

// Generate a 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Nodemailer configuration for Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "bloggy372@gmail.com",
    pass: "azby ctkh jlnv fcrt",
  },
});

// Function to send OTP
const sendOTP = async (email, generatedotp) => {
  const mailOptions = {
    from: "bloggy372@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${generatedotp}`,
    html: `<b>Your OTP code is ${generatedotp}</b>`,
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
  const { email, name, password, flag, statusCode } = req.body;

  console.log("Received status code from frontend:", statusCode);

  // Generate OTP
  const generatedotp = generateOTP();

  try {
    // Check if email already exists
    const existMail = await Register.findOne({ email });

    if (existMail) {
      if (existMail.flag == 1) {
        console.log("Sending response: Email already exists");
        return res.status(400).json({ message: "Email already exists", statusCode });
      } else {
        await sendOTP(email, generatedotp);
        existMail.name = name;
        existMail.password = password;
        existMail.otp = generatedotp; 
        await existMail.save();
        console.log(`Updated DB: ${JSON.stringify(existMail)}`);
        console.log("Sending response: OTP sent successfully");
        res.status(200).json({ message: "OTP sent successfully", statusCode });
      }
    } else {
      // Save registration data to the database
      const registerEntry = new Register({
        email,
        name,
        password,
        otp: generatedotp,
        flag:0,
      });
      await sendOTP(email, generatedotp);
      await registerEntry.save();
      console.log(`Saved to DB: ${JSON.stringify(registerEntry)}`);
      console.log("Sending response: OTP sent successfully");
      res.status(200).json({ message: "OTP sent successfully", statusCode });
    }
  } catch (error) {
    console.error("Error saving registration data or sending email:", error);
    res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
      error: error.toString(),
      statusCode,
    });
  }
});

// Verify OTP endpoint
app.post("/verify-otp", async (req, res) => {
  const { email, otp, statusCode } = req.body;

  console.log(`email: ${email} , otp: ${otp}`)
  console.log("Received status code from frontend:", statusCode);

  try {
    const otpEntry = await Register.findOne({ email, otp });

    if (otpEntry) {
      // Update the flag to indicate successful registration
      otpEntry.flag = 1;
      await otpEntry.save();
      console.log("Sending response: OTP verified and registration completed successfully");
      res.status(200).json({
        message: "OTP verified and registration completed successfully",
        statusCode,
      });
    } else {
      console.log("Sending response: Invalid OTP");
      res.status(400).json({ message: "Invalid OTP", statusCode });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP. Please try again later.", statusCode });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Register.findOne({ email, password });

    if (user) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
