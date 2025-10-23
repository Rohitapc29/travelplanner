const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.put("/update", updateProfile);
router.put("/change-password", changePassword);

module.exports = router;
