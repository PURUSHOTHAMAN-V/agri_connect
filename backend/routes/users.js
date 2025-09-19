const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { authenticateToken, requireVerification } = require('../middleware/auth');

const router = express.Router();

// Get user profile
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
      data: user
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
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email address'),
  body('district').optional().trim().isLength({ min: 2, max: 100 }).withMessage('District must be between 2 and 100 characters'),
  body('taluk').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Taluk must be between 2 and 100 characters'),
  body('village').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Village must be between 2 and 100 characters'),
  body('address').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Address must be between 10 and 500 characters'),
  body('bank_account').optional().trim().isLength({ min: 9, max: 20 }).withMessage('Bank account must be between 9 and 20 characters'),
  body('ifsc_code').optional().trim().isLength({ min: 11, max: 11 }).withMessage('IFSC code must be 11 characters'),
  body('language').optional().isIn(['tamil', 'english']).withMessage('Language must be tamil or english')
], async (req, res) => {
  try {
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
      data: {
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

// Upload profile image
router.post('/profile-image', authenticateToken, requireVerification, async (req, res) => {
  try {
    // This would typically use multer middleware for file upload
    // For now, we'll accept a URL
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({
        error: 'Image URL required',
        message: 'Please provide a valid image URL'
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    await user.update({ profile_image: image_url });

    res.json({
      message: 'Profile image updated successfully',
      data: { profile_image: image_url }
    });

  } catch (error) {
    console.error('Profile image update error:', error);
    res.status(500).json({
      error: 'Profile image update failed',
      message: 'An error occurred while updating profile image'
    });
  }
});

// Update location
router.put('/location', authenticateToken, [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { latitude, longitude } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    await user.update({ latitude, longitude });

    res.json({
      message: 'Location updated successfully',
      data: { latitude, longitude }
    });

  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({
      error: 'Location update failed',
      message: 'An error occurred while updating location'
    });
  }
});

// Get nearby users
router.get('/nearby', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, user_type, limit = 20 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Location required',
        message: 'Latitude and longitude are required'
      });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);
    const searchRadius = parseFloat(radius);

    // Calculate distance using Haversine formula
    const distanceQuery = `
      SELECT *,
      (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians($2)) + sin(radians($1)) * 
      sin(radians(latitude)))) AS distance
      FROM "User" 
      WHERE latitude IS NOT NULL 
      AND longitude IS NOT NULL
      AND id != $3
      AND is_active = true
      ${user_type ? 'AND user_type = $4' : ''}
      HAVING distance <= $5
      ORDER BY distance
      LIMIT $6
    `;

    const queryParams = [userLat, userLng, req.user.id];
    if (user_type) queryParams.push(user_type);
    queryParams.push(searchRadius, parseInt(limit));

    const nearbyUsers = await sequelize.query(distanceQuery, {
      replacements: queryParams,
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      message: 'Nearby users retrieved successfully',
      data: nearbyUsers
    });

  } catch (error) {
    console.error('Nearby users retrieval error:', error);
    res.status(500).json({
      error: 'Nearby users retrieval failed',
      message: 'An error occurred while retrieving nearby users'
    });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { Product, Order } = require('../models');
    
    let stats = {};

    if (req.user.user_type === 'farmer') {
      // Farmer statistics
      const [totalProducts, activeProducts, totalOrders, totalEarnings] = await Promise.all([
        Product.count({ where: { farmer_id: req.user.id } }),
        Product.count({ where: { farmer_id: req.user.id, is_available: true } }),
        Order.count({ where: { farmer_id: req.user.id } }),
        Order.sum('total_amount', { where: { farmer_id: req.user.id, payment_status: 'paid' } })
      ]);

      stats = {
        total_products: totalProducts,
        active_products: activeProducts,
        total_orders: totalOrders,
        total_earnings: totalEarnings || 0
      };
    } else if (req.user.user_type === 'buyer') {
      // Buyer statistics
      const [totalOrders, totalSpent, pendingOrders] = await Promise.all([
        Order.count({ where: { buyer_id: req.user.id } }),
        Order.sum('total_amount', { where: { buyer_id: req.user.id, payment_status: 'paid' } }),
        Order.count({ where: { buyer_id: req.user.id, status: 'pending' } })
      ]);

      stats = {
        total_orders: totalOrders,
        total_spent: totalSpent || 0,
        pending_orders: pendingOrders
      };
    }

    res.json({
      message: 'User statistics retrieved successfully',
      data: stats
    });

  } catch (error) {
    console.error('User statistics error:', error);
    res.status(500).json({
      error: 'User statistics failed',
      message: 'An error occurred while retrieving user statistics'
    });
  }
});

// Deactivate account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    // Check for pending orders
    const { Order } = require('../models');
    const pendingOrders = await Order.count({
      where: {
        [req.user.user_type === 'farmer' ? 'farmer_id' : 'buyer_id']: req.user.id,
        status: ['pending', 'confirmed', 'shipped']
      }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({
        error: 'Cannot deactivate account',
        message: 'You have pending orders. Please complete or cancel them before deactivating your account.'
      });
    }

    await user.update({ is_active: false });

    res.json({
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Account deactivation error:', error);
    res.status(500).json({
      error: 'Account deactivation failed',
      message: 'An error occurred while deactivating the account'
    });
  }
});

module.exports = router;

