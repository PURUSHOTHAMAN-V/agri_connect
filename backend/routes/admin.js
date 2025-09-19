const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, Product, Order, PriceHistory, ChatMessage } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalProducts,
      totalOrders,
      totalRevenue,
      activeUsers,
      pendingVerifications
    ] = await Promise.all([
      User.count(),
      User.count({ where: { user_type: 'farmer' } }),
      User.count({ where: { user_type: 'buyer' } }),
      Product.count(),
      Order.count(),
      Order.sum('total_amount', { where: { payment_status: 'paid' } }),
      User.count({ where: { is_active: true } }),
      User.count({ where: { is_verified: false } })
    ]);

    // Get recent activity
    const recentOrders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'district']
        },
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'district']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    // Get monthly statistics
    const currentMonth = new Date();
    currentMonth.setDate(1);
    
    const monthlyStats = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      where: {
        created_at: {
          [Op.gte]: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 11, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'ASC']]
    });

    res.json({
      message: 'Dashboard statistics retrieved successfully',
      data: {
        overview: {
          total_users: totalUsers,
          total_farmers: totalFarmers,
          total_buyers: totalBuyers,
          total_products: totalProducts,
          total_orders: totalOrders,
          total_revenue: totalRevenue || 0,
          active_users: activeUsers,
          pending_verifications: pendingVerifications
        },
        recent_activity: recentOrders,
        monthly_stats: monthlyStats
      }
    });

  } catch (error) {
    console.error('Dashboard statistics error:', error);
    res.status(500).json({
      error: 'Dashboard statistics failed',
      message: 'An error occurred while retrieving dashboard statistics'
    });
  }
});

// Get all users with filters
router.get('/users', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      user_type,
      district,
      is_verified,
      is_active,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (user_type) whereClause.user_type = user_type;
    if (district) whereClause.district = district;
    if (is_verified !== undefined) whereClause.is_verified = is_verified === 'true';
    if (is_active !== undefined) whereClause.is_active = is_active === 'true';
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_users: count,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Users retrieval error:', error);
    res.status(500).json({
      error: 'Users retrieval failed',
      message: 'An error occurred while retrieving users'
    });
  }
});

// Get user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    // Get user statistics
    let userStats = {};
    if (user.user_type === 'farmer') {
      const [totalProducts, totalOrders, totalEarnings] = await Promise.all([
        Product.count({ where: { farmer_id: user.id } }),
        Order.count({ where: { farmer_id: user.id } }),
        Order.sum('total_amount', { where: { farmer_id: user.id, payment_status: 'paid' } })
      ]);
      userStats = { totalProducts, totalOrders, totalEarnings: totalEarnings || 0 };
    } else if (user.user_type === 'buyer') {
      const [totalOrders, totalSpent] = await Promise.all([
        Order.count({ where: { buyer_id: user.id } }),
        Order.sum('total_amount', { where: { buyer_id: user.id, payment_status: 'paid' } })
      ]);
      userStats = { totalOrders, totalSpent: totalSpent || 0 };
    }

    res.json({
      message: 'User details retrieved successfully',
      data: {
        user,
        statistics: userStats
      }
    });

  } catch (error) {
    console.error('User details error:', error);
    res.status(500).json({
      error: 'User details failed',
      message: 'An error occurred while retrieving user details'
    });
  }
});

// Update user verification status
router.patch('/users/:id/verify', [
  body('is_verified').isBoolean().withMessage('Verification status must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { is_verified } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    await user.update({ is_verified });

    res.json({
      message: `User ${is_verified ? 'verified' : 'unverified'} successfully`,
      data: { is_verified }
    });

  } catch (error) {
    console.error('User verification error:', error);
    res.status(500).json({
      error: 'User verification failed',
      message: 'An error occurred while updating user verification'
    });
  }
});

// Update user active status
router.patch('/users/:id/status', [
  body('is_active').isBoolean().withMessage('Active status must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { is_active } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    await user.update({ is_active });

    res.json({
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: { is_active }
    });

  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({
      error: 'User status update failed',
      message: 'An error occurred while updating user status'
    });
  }
});

// Get all products with filters
router.get('/products', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      farmer_id,
      district,
      crop_type,
      is_available,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (farmer_id) whereClause.farmer_id = farmer_id;
    if (district) whereClause.district = district;
    if (is_available !== undefined) whereClause.is_available = is_available === 'true';
    if (search) {
      whereClause[Op.or] = [
        { variety: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'district', 'phone_number']
        },
        {
          model: Crop,
          as: 'crop',
          attributes: ['id', 'crop_name', 'crop_name_tamil', 'category']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Apply crop type filter
    if (crop_type) {
      products = products.filter(product => product.crop.category === crop_type);
    }

    res.json({
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_products: count,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Products retrieval error:', error);
    res.status(500).json({
      error: 'Products retrieval failed',
      message: 'An error occurred while retrieving products'
    });
  }
});

// Get all orders with filters
router.get('/orders', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      payment_status,
      farmer_id,
      buyer_id,
      start_date,
      end_date
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (status) whereClause.status = status;
    if (payment_status) whereClause.payment_status = payment_status;
    if (farmer_id) whereClause.farmer_id = farmer_id;
    if (buyer_id) whereClause.buyer_id = buyer_id;
    if (start_date || end_date) {
      whereClause.created_at = {};
      if (start_date) whereClause.created_at[Op.gte] = new Date(start_date);
      if (end_date) whereClause.created_at[Op.lte] = new Date(end_date);
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'district', 'phone_number']
        },
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'district', 'phone_number']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'variety', 'grade', 'unit']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      message: 'Orders retrieved successfully',
      data: {
        orders,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_orders: count,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Orders retrieval error:', error);
    res.status(500).json({
      error: 'Orders retrieval failed',
      message: 'An error occurred while retrieving orders'
    });
  }
});

// Get system analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get user growth
    const userGrowth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: { [Op.gte]: startDate }
      },
      group: [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE_TRUNC', 'day', sequelize.col('created_at')), 'ASC']]
    });

    // Get order trends
    const orderTrends = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      where: {
        created_at: { [Op.gte]: startDate }
      },
      group: [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE_TRUNC', 'day', sequelize.col('created_at')), 'ASC']]
    });

    // Get district-wise statistics
    const districtStats = await User.findAll({
      attributes: [
        'district',
        [sequelize.fn('COUNT', sequelize.col('id')), 'user_count'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN user_type = \'farmer\' THEN 1 END')), 'farmers'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN user_type = \'buyer\' THEN 1 END')), 'buyers']
      ],
      where: {
        is_active: true
      },
      group: ['district'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    res.json({
      message: 'Analytics retrieved successfully',
      data: {
        period: {
          days,
          start_date: startDate,
          end_date: new Date()
        },
        user_growth: userGrowth,
        order_trends: orderTrends,
        district_stats: districtStats
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: 'Analytics failed',
      message: 'An error occurred while retrieving analytics'
    });
  }
});

module.exports = router;

