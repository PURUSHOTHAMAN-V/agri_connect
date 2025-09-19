const express = require('express');
const { body, validationResult } = require('express-validator');
const { ChatMessage, User, Product } = require('../models');
const { authenticateToken, requireVerification } = require('../middleware/auth');

const router = express.Router();

// Send message
router.post('/send', authenticateToken, requireVerification, [
  body('receiver_id').isUUID().withMessage('Valid receiver ID is required'),
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('product_id').optional().isUUID().withMessage('Valid product ID is required'),
  body('message_type').optional().isIn(['text', 'image', 'file', 'offer']).withMessage('Invalid message type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { receiver_id, message, product_id, message_type = 'text' } = req.body;

    // Check if receiver exists
    const receiver = await User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({
        error: 'Receiver not found',
        message: 'The specified receiver does not exist'
      });
    }

    // Check if product exists (if provided)
    if (product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
          message: 'The specified product does not exist'
        });
      }
    }

    // Create message
    const chatMessage = await ChatMessage.create({
      sender_id: req.user.id,
      receiver_id,
      product_id,
      message,
      message_type,
      is_read: false
    });

    // Fetch created message with associations
    const createdMessage = await ChatMessage.findByPk(chatMessage.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'profile_image']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'profile_image']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'variety', 'grade', 'price_per_unit', 'unit']
        }
      ]
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: createdMessage
    });

  } catch (error) {
    console.error('Message sending error:', error);
    res.status(500).json({
      error: 'Message sending failed',
      message: 'An error occurred while sending the message'
    });
  }
});

// Get conversation between two users
router.get('/conversation/:otherUserId', authenticateToken, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Check if other user exists
    const otherUser = await User.findByPk(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    // Get messages between the two users
    const { count, rows: messages } = await ChatMessage.findAndCountAll({
      where: {
        [Op.or]: [
          { sender_id: req.user.id, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: req.user.id }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'profile_image']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'variety', 'grade', 'price_per_unit', 'unit']
        }
      ],
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Mark messages as read
    await ChatMessage.update(
      { is_read: true },
      {
        where: {
          sender_id: otherUserId,
          receiver_id: req.user.id,
          is_read: false
        }
      }
    );

    res.json({
      message: 'Conversation retrieved successfully',
      data: {
        messages,
        other_user: {
          id: otherUser.id,
          name: otherUser.name,
          profile_image: otherUser.profile_image
        },
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_messages: count,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Conversation retrieval error:', error);
    res.status(500).json({
      error: 'Conversation retrieval failed',
      message: 'An error occurred while retrieving the conversation'
    });
  }
});

// Get user's conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get unique conversations for the user
    const conversations = await ChatMessage.findAll({
      attributes: [
        'sender_id',
        'receiver_id',
        [sequelize.fn('MAX', sequelize.col('created_at')), 'last_message_time'],
        [sequelize.fn('COUNT', sequelize.literal('CASE WHEN is_read = false AND receiver_id = :userId THEN 1 END')), 'unread_count']
      ],
      where: {
        [Op.or]: [
          { sender_id: req.user.id },
          { receiver_id: req.user.id }
        ]
      },
      group: [
        sequelize.fn('LEAST', sequelize.col('sender_id'), sequelize.col('receiver_id')),
        sequelize.fn('GREATEST', sequelize.col('sender_id'), sequelize.col('receiver_id'))
      ],
      having: {
        [Op.or]: [
          { sender_id: req.user.id },
          { receiver_id: req.user.id }
        ]
      },
      order: [[sequelize.literal('last_message_time'), 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      replacements: { userId: req.user.id }
    });

    // Get user details for each conversation
    const conversationDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.sender_id === req.user.id ? conv.receiver_id : conv.sender_id;
        const otherUser = await User.findByPk(otherUserId, {
          attributes: ['id', 'name', 'profile_image', 'user_type']
        });

        // Get last message
        const lastMessage = await ChatMessage.findOne({
          where: {
            [Op.or]: [
              { sender_id: req.user.id, receiver_id: otherUserId },
              { sender_id: otherUserId, receiver_id: req.user.id }
            ]
          },
          order: [['created_at', 'DESC']],
          attributes: ['message', 'message_type', 'created_at', 'is_read']
        });

        return {
          other_user: otherUser,
          last_message: lastMessage,
          unread_count: conv.unread_count || 0
        };
      })
    );

    res.json({
      message: 'Conversations retrieved successfully',
      data: conversationDetails
    });

  } catch (error) {
    console.error('Conversations retrieval error:', error);
    res.status(500).json({
      error: 'Conversations retrieval failed',
      message: 'An error occurred while retrieving conversations'
    });
  }
});

// Mark messages as read
router.patch('/mark-read', authenticateToken, [
  body('sender_id').isUUID().withMessage('Valid sender ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { sender_id } = req.body;

    await ChatMessage.update(
      { is_read: true },
      {
        where: {
          sender_id,
          receiver_id: req.user.id,
          is_read: false
        }
      }
    );

    res.json({
      message: 'Messages marked as read successfully'
    });

  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      error: 'Mark read failed',
      message: 'An error occurred while marking messages as read'
    });
  }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const unreadCount = await ChatMessage.count({
      where: {
        receiver_id: req.user.id,
        is_read: false
      }
    });

    res.json({
      message: 'Unread count retrieved successfully',
      data: { unread_count: unreadCount }
    });

  } catch (error) {
    console.error('Unread count retrieval error:', error);
    res.status(500).json({
      error: 'Unread count retrieval failed',
      message: 'An error occurred while retrieving unread count'
    });
  }
});

module.exports = router;

