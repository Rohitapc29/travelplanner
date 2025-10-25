const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
  verifyToken,
} = require("../controllers/userController");

// Public routes
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Protected routes 
router.get("/verify-token", authenticate, verifyToken);
router.post("/update-profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);

module.exports = router;
