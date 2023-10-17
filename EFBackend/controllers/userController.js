const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user (both farmer and customer)
exports.registerUser = async (req, res) => {
  try {
    const { email, password, role, name, phoneNumber } = req.body;

    // Check if the user already exists
    const existingEmail = await User.findOne({ email });
    const existingPhoneNumber = await User.findOne({ phoneNumber });

    if (existingEmail) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (existingPhoneNumber) {
      return res.status(400).json({ message: "Use a different phone number" });
    }

    // Hash the password
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password,
      role, // Role can be 'farmer' or 'customer'
      name, // Required name field
      phoneNumber, // Required phoneNumber field
    });

    // Save the user to the database
    await newUser.save();

    // Create and send a JWT token for authentication
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(201).json({ token, userId: newUser._id, role: newUser.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid pass" });
    }

    // Create and send a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(200).json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
