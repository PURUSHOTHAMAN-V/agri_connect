const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, Product, User } = require('../models');
const { authenticateToken, requireVerification } = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', authenticateToken, requireVerification, [
  body('product_id').isUUID().withMessage('Valid product ID is required'),
  body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
  body('delivery_address').trim().isLength({ min: 10 }).withMessage('Delivery address must be at least 10 characters'),
  body('delivery_date').optional().isISO8601().withMessage('Valid delivery date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { product_id, quantity, delivery_address, delivery_date, notes } = req.body;

    // Get product details
    const product = await Product.findByPk(product_id, {
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'district']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    if (!product.is_available) {
      return res.status(400).json({
        error: 'Product unavailable',
        message: 'This product is currently unavailable'
      });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({
        error: 'Insufficient quantity',
        message: `Only ${product.quantity} ${product.unit} available`
      });
    }

    // Calculate total amount
    const total_amount = quantity * product.price_per_unit;

    // Create order
    const order = await Order.create({
      buyer_id: req.user.id,
      farmer_id: product.farmer_id,
      product_id,
      quantity,
      unit_price: product.price_per_unit,
      total_amount,
      delivery_address,
      delivery_date,
      notes,
      status: 'pending',
      payment_status: 'pending'
    });

    // Fetch created order with associations
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'phone_number', 'district']
        },
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'phone_number', 'district']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'variety', 'grade', 'unit', 'harvest_date']
        }
      ]
    });

    res.status(201).json({
      message: 'Order created successfully',
      data: createdOrder
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      error: 'Order creation failed',
      message: 'An error occurred while creating the order'
    });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      [req.user.user_type === 'farmer' ? 'farmer_id' : 'buyer_id']: req.user.id
    };

    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: req.user.user_type === 'farmer' ? 'buyer' : 'farmer',
          attributes: ['id', 'name', 'phone_number', 'district', 'profile_image']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'variety', 'grade', 'unit', 'harvest_date']
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

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'phone_number', 'district', 'profile_image']
        },
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'phone_number', 'district', 'profile_image']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'variety', 'grade', 'unit', 'harvest_date', 'description']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order does not exist'
      });
    }

    // Check if user has access to this order
    if (order.buyer_id !== req.user.id && order.farmer_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view this order'
      });
    }

    res.json({
      message: 'Order retrieved successfully',
      data: order
    });

  } catch (error) {
    console.error('Order retrieval error:', error);
    res.status(500).json({
      error: 'Order retrieval failed',
      message: 'An error occurred while retrieving the order'
    });
  }
});

// Update order status
router.patch('/:id/status', authenticateToken, requireVerification, [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { status, notes } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order does not exist'
      });
    }

    // Check if user has permission to update this order
    if (order.buyer_id !== req.user.id && order.farmer_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to update this order'
      });
    }

    // Validate status transitions
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status transition',
        message: `Cannot change status from ${order.status} to ${status}`
      });
    }

    // Update order
    const updateData = { status };
    if (notes) updateData.notes = notes;

    await order.update(updateData);

    // If order is cancelled, update product quantity
    if (status === 'cancelled') {
      const product = await Product.findByPk(order.product_id);
      if (product) {
        await product.update({
          quantity: product.quantity + order.quantity
        });
      }
    }

    res.json({
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({
      error: 'Order status update failed',
      message: 'An error occurred while updating order status'
    });
  }
});

// Update payment status
router.patch('/:id/payment', authenticateToken, requireVerification, [
  body('payment_status').isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { payment_status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order does not exist'
      });
    }

    // Check if user has permission to update payment status
    if (order.buyer_id !== req.user.id && order.farmer_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to update payment status'
      });
    }

    await order.update({ payment_status });

    res.json({
      message: 'Payment status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Payment status update error:', error);
    res.status(500).json({
      error: 'Payment status update failed',
      message: 'An error occurred while updating payment status'
    });
  }
});

module.exports = router;

