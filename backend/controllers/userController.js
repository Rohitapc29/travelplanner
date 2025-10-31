const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-this', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, travellerType } = req.body;

    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      travellerType,
      joined: new Date(), 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        travellerType: user.travellerType,
        joined: user.joined.toLocaleDateString(), 
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'admin@travelmate.com';
    const ADMIN_PASSWORD = 'admin123';

    // Check if it's admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = await User.findOne({ email: ADMIN_EMAIL });
      
      if (!adminUser) {
        // Create admin user if doesn't exist
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
        const adminUser = await User.create({
          name: 'Admin',
          email: ADMIN_EMAIL,
          phone: '0000000000',
          password: hashedPassword,
          travellerType: 'admin',
          isAdmin: true,
          isPremium: true 
        });
      }

      return res.json({
        user: {
          _id: adminUser?._id || 'admin',
          name: 'Admin',
          email: ADMIN_EMAIL,
          isAdmin: true,
          isPremium: true,
          joined: new Date().toLocaleDateString(),
        },
        token: generateToken(adminUser?._id || 'admin'),
      });
    }

    // Regular user login
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const isValidPremium = user.isPremium && 
        (!user.premiumExpiryDate || new Date() < user.premiumExpiryDate);
      
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          travellerType: user.travellerType,
          isAdmin: false,
          isPremium: isValidPremium, 
          subscriptionType: user.subscriptionType, 
          premiumExpiryDate: user.premiumExpiryDate, 
          joined: user.joined.toLocaleDateString(), 
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isValidPremium = user.isPremium && 
      (!user.premiumExpiryDate || new Date() < user.premiumExpiryDate);
    
    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        travellerType: req.user.travellerType,
        isPremium: isValidPremium, 
        subscriptionType: user.subscriptionType, 
        premiumExpiryDate: user.premiumExpiryDate, 
        joined: req.user.joined.toLocaleDateString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { phone, travellerType } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { phone, travellerType },
      { new: true }
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        travellerType: user.travellerType,
        joined: user.joined.toLocaleDateString(), 
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { current, newPass } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!(await bcrypt.compare(current, user.password))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken, 
  updateProfile,
  changePassword,
};
