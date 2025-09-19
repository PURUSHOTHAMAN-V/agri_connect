const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Product, User, Crop, Order } = require('../models');
const { authenticateToken, requireVerification } = require('../middleware/auth');

const router = express.Router();

// Get all products with filters
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('district').optional().isString().withMessage('District must be a string'),
  query('crop_type').optional().isString().withMessage('Crop type must be a string'),
  query('grade').optional().isIn(['A', 'B', 'C']).withMessage('Grade must be A, B, or C'),
  query('min_price').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('max_price').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sort_by').optional().isIn(['price', 'rating', 'harvest_date', 'created_at']).withMessage('Invalid sort field'),
  query('sort_order').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      district,
      crop_type,
      grade,
      min_price,
      max_price,
      sort_by = 'created_at',
      sort_order = 'desc',
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { is_available: true };

    // Apply filters
    if (district) whereClause.district = district;
    if (grade) whereClause.grade = grade;
    if (min_price || max_price) {
      whereClause.price_per_unit = {};
      if (min_price) whereClause.price_per_unit[Op.gte] = parseFloat(min_price);
      if (max_price) whereClause.price_per_unit[Op.lte] = parseFloat(max_price);
    }

    const includeOptions = [
      {
        model: User,
        as: 'farmer',
        attributes: ['id', 'name', 'district', 'rating', 'profile_image']
      },
      {
        model: Crop,
        as: 'crop',
        attributes: ['id', 'crop_name', 'crop_name_tamil', 'category']
      }
    ];

    // Add crop type filter
    if (crop_type) {
      includeOptions[1].where = { category: crop_type };
    }

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { variety: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

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

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'district', 'taluk', 'village', 'phone_number', 'rating', 'profile_image']
        },
        {
          model: Crop,
          as: 'crop',
          attributes: ['id', 'crop_name', 'crop_name_tamil', 'category', 'harvest_season']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    res.json({
      message: 'Product retrieved successfully',
      data: product
    });

  } catch (error) {
    console.error('Product retrieval error:', error);
    res.status(500).json({
      error: 'Product retrieval failed',
      message: 'An error occurred while retrieving the product'
    });
  }
});

// Create new product (farmer only)
router.post('/', authenticateToken, requireVerification, [
  body('crop_id').isUUID().withMessage('Valid crop ID is required'),
  body('variety').trim().isLength({ min: 1, max: 100 }).withMessage('Variety is required and must be less than 100 characters'),
  body('grade').isIn(['A', 'B', 'C']).withMessage('Grade must be A, B, or C'),
  body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
  body('unit').isIn(['quintal', 'kilogram', 'tonne']).withMessage('Unit must be quintal, kilogram, or tonne'),
  body('price_per_unit').isFloat({ min: 0.01 }).withMessage('Price per unit must be greater than 0'),
  body('harvest_date').isISO8601().withMessage('Valid harvest date is required'),
  body('delivery_window').isInt({ min: 1, max: 365 }).withMessage('Delivery window must be between 1 and 365 days')
], async (req, res) => {
  try {
    // Check if user is a farmer
    if (req.user.user_type !== 'farmer') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only farmers can create products'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      crop_id,
      variety,
      grade,
      quantity,
      unit,
      price_per_unit,
      harvest_date,
      delivery_window,
      description,
      images,
      is_organic,
      certification
    } = req.body;

    const product = await Product.create({
      farmer_id: req.user.id,
      crop_id,
      variety,
      grade,
      quantity,
      unit,
      price_per_unit,
      harvest_date,
      delivery_window,
      description,
      images: images || [],
      is_organic: is_organic || false,
      certification,
      is_available: true
    });

    // Fetch the created product with associations
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'district', 'rating']
        },
        {
          model: Crop,
          as: 'crop',
          attributes: ['id', 'crop_name', 'crop_name_tamil', 'category']
        }
      ]
    });

    res.status(201).json({
      message: 'Product created successfully',
      data: createdProduct
    });

  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      error: 'Product creation failed',
      message: 'An error occurred while creating the product'
    });
  }
});

// Update product (farmer only)
router.put('/:id', authenticateToken, requireVerification, [
  body('variety').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Variety must be less than 100 characters'),
  body('grade').optional().isIn(['A', 'B', 'C']).withMessage('Grade must be A, B, or C'),
  body('quantity').optional().isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
  body('price_per_unit').optional().isFloat({ min: 0.01 }).withMessage('Price per unit must be greater than 0'),
  body('delivery_window').optional().isInt({ min: 1, max: 365 }).withMessage('Delivery window must be between 1 and 365 days')
], async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    // Check if user owns the product
    if (product.farmer_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own products'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const allowedUpdates = [
      'variety', 'grade', 'quantity', 'unit', 'price_per_unit',
      'delivery_window', 'description', 'images', 'is_organic',
      'certification', 'is_available'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    await product.update(updates);

    // Fetch updated product with associations
    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'district', 'rating']
        },
        {
          model: Crop,
          as: 'crop',
          attributes: ['id', 'crop_name', 'crop_name_tamil', 'category']
        }
      ]
    });

    res.json({
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({
      error: 'Product update failed',
      message: 'An error occurred while updating the product'
    });
  }
});

// Delete product (farmer only)
router.delete('/:id', authenticateToken, requireVerification, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    // Check if user owns the product
    if (product.farmer_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own products'
      });
    }

    // Check if product has any pending orders
    const pendingOrders = await Order.count({
      where: {
        product_id: product.id,
        status: ['pending', 'confirmed']
      }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({
        error: 'Cannot delete product',
        message: 'Product has pending orders and cannot be deleted'
      });
    }

    await product.destroy();

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({
      error: 'Product deletion failed',
      message: 'An error occurred while deleting the product'
    });
  }
});

// Get farmer's products
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: { farmer_id: farmerId, is_available: true },
      include: [
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

    res.json({
      message: 'Farmer products retrieved successfully',
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
    console.error('Farmer products retrieval error:', error);
    res.status(500).json({
      error: 'Farmer products retrieval failed',
      message: 'An error occurred while retrieving farmer products'
    });
  }
});

module.exports = router;

