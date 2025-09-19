const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('phone_number')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian phone number'),
  body('user_type')
    .isIn(['farmer', 'buyer', 'retailer'])
    .withMessage('User type must be farmer, buyer, or retailer'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('district')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('District is required'),
  body('aadhar_number')
    .optional()
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('Aadhar number must be 12 digits'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
];

const loginValidation = [
  body('phone_number')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian phone number'),
  body('user_type')
    .isIn(['farmer', 'buyer', 'retailer'])
    .withMessage('User type must be farmer, buyer, or retailer')
];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
  );
};

// Register new user
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      phone_number,
      user_type,
      name,
      email,
      aadhar_number,
      gst_number,
      district,
      taluk,
      village,
      address,
      bank_account,
      ifsc_code,
      language = 'tamil'
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { phone_number }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this phone number already exists'
      });
    }

    // Check Aadhar uniqueness if provided
    if (aadhar_number) {
      const existingAadhar = await User.findOne({
        where: { aadhar_number }
      });

      if (existingAadhar) {
        return res.status(409).json({
          error: 'Aadhar already registered',
          message: 'This Aadhar number is already registered'
        });
      }
    }

    // Create new user
    const user = await User.create({
      phone_number,
      user_type,
      name,
      email,
      aadhar_number,
      gst_number,
      district,
      taluk,
      village,
      address,
      bank_account,
      ifsc_code,
      language,
      is_verified: false,
      is_active: true
    });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Return user data (excluding sensitive information)
    const userResponse = {
      id: user.id,
      phone_number: user.phone_number,
      user_type: user.user_type,
      name: user.name,
      email: user.email,
      district: user.district,
      taluk: user.taluk,
      village: user.village,
      is_verified: user.is_verified,
      language: user.language,
      created_at: user.created_at
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

// Login user
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { phone_number, user_type } = req.body;

    // Find user
    const user = await User.findOne({
      where: { phone_number, user_type }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Phone number or user type is incorrect'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        error: 'Account deactivated',
        message: 'Your account has been deactivated'
      });
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Return user data (excluding sensitive information)
    const userResponse = {
      id: user.id,
      phone_number: user.phone_number,
      user_type: user.user_type,
      name: user.name,
      email: user.email,
      district: user.district,
      taluk: user.taluk,
      village: user.village,
      is_verified: user.is_verified,
      language: user.language,
      profile_image: user.profile_image,
      created_at: user.created_at
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token required',
        message: 'Please provide a refresh token'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        message: 'Refresh token is invalid or user is inactive'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Token refresh failed',
      message: 'Invalid or expired refresh token'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    res.json({
      message: 'Profile retrieved successfully',
      user
    });

  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      error: 'Profile retrieval failed',
      message: 'An error occurred while retrieving profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('district')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('District must be between 2 and 100 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const allowedUpdates = [
      'name', 'email', 'district', 'taluk', 'village', 
      'address', 'bank_account', 'ifsc_code', 'language'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    await user.update(updates);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        phone_number: user.phone_number,
        user_type: user.user_type,
        name: user.name,
        email: user.email,
        district: user.district,
        taluk: user.taluk,
        village: user.village,
        is_verified: user.is_verified,
        language: user.language,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'An error occurred while updating profile'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Logout successful'
  });
});

module.exports = router;

