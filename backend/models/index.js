const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  phone_number: {
    type: DataTypes.STRING(15),
    unique: true,
    allowNull: false
  },
  user_type: {
    type: DataTypes.ENUM('farmer', 'buyer', 'retailer', 'admin'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true
  },
  aadhar_number: {
    type: DataTypes.STRING(12),
    unique: true,
    allowNull: true
  },
  gst_number: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  taluk: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  village: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bank_account: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  ifsc_code: {
    type: DataTypes.STRING(11),
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  language: {
    type: DataTypes.ENUM('tamil', 'english'),
    defaultValue: 'tamil'
  },
  profile_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  }
});

// Crop Model
const Crop = sequelize.define('Crop', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  crop_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  crop_name_tamil: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  harvest_season: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  typical_districts: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Product Model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  farmer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  crop_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Crop',
      key: 'id'
    }
  },
  variety: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  grade: {
    type: DataTypes.ENUM('A', 'B', 'C'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  unit: {
    type: DataTypes.ENUM('quintal', 'kilogram', 'tonne'),
    allowNull: false
  },
  price_per_unit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  harvest_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  delivery_window: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Delivery window in days'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_organic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  certification: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
});

// Order Model
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  buyer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  farmer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Product',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  delivery_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Price History Model
const PriceHistory = sequelize.define('PriceHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  crop_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Crop',
      key: 'id'
    }
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  price_per_kg: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  source: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  grade: {
    type: DataTypes.ENUM('A', 'B', 'C'),
    allowNull: false
  }
});

// Price Prediction Model
const PricePrediction = sequelize.define('PricePrediction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  crop_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Crop',
      key: 'id'
    }
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  predicted_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  confidence_score: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false
  },
  prediction_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  model_version: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
});

// Chat Message Model
const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sender_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  receiver_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Product',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  message_type: {
    type: DataTypes.ENUM('text', 'image', 'file', 'offer'),
    defaultValue: 'text'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Contract Model
const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Order',
      key: 'id'
    }
  },
  farmer_signature: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  buyer_signature: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contract_terms: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'signed', 'executed', 'terminated'),
    defaultValue: 'draft'
  }
});

// Define associations
User.hasMany(Product, { foreignKey: 'farmer_id', as: 'products' });
Product.belongsTo(User, { foreignKey: 'farmer_id', as: 'farmer' });

User.hasMany(Order, { foreignKey: 'buyer_id', as: 'buyerOrders' });
User.hasMany(Order, { foreignKey: 'farmer_id', as: 'farmerOrders' });
Order.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
Order.belongsTo(User, { foreignKey: 'farmer_id', as: 'farmer' });

Product.belongsTo(Crop, { foreignKey: 'crop_id', as: 'crop' });
Crop.hasMany(Product, { foreignKey: 'crop_id', as: 'products' });

Order.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(Order, { foreignKey: 'product_id', as: 'orders' });

Crop.hasMany(PriceHistory, { foreignKey: 'crop_id', as: 'priceHistory' });
PriceHistory.belongsTo(Crop, { foreignKey: 'crop_id', as: 'crop' });

Crop.hasMany(PricePrediction, { foreignKey: 'crop_id', as: 'pricePredictions' });
PricePrediction.belongsTo(Crop, { foreignKey: 'crop_id', as: 'crop' });

User.hasMany(ChatMessage, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(ChatMessage, { foreignKey: 'receiver_id', as: 'receivedMessages' });
ChatMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
ChatMessage.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

Product.hasMany(ChatMessage, { foreignKey: 'product_id', as: 'messages' });
ChatMessage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Order.hasOne(Contract, { foreignKey: 'order_id', as: 'contract' });
Contract.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = {
  User,
  Crop,
  Product,
  Order,
  PriceHistory,
  PricePrediction,
  ChatMessage,
  Contract,
  sequelize
};

