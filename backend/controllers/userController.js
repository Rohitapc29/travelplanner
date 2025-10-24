const User = require("../models/User");
const bcrypt = require("bcryptjs");

//  Signup
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, travellerType, password } = req.body;

    // validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      travellerType,
      password: hashed,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { email, phone, travellerType } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { phone, travellerType },
      { new: true }
    );
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { email, current, newPass } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(current, user.password);
    if (!valid)
      return res.status(400).json({ message: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPass, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { registerUser, loginUser, updateProfile, changePassword };
