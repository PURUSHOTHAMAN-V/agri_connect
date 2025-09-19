const express = require('express');
const axios = require('axios');
const { PricePrediction, PriceHistory, Crop } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get price predictions for a crop
router.get('/predictions/:cropId', authenticateToken, async (req, res) => {
  try {
    const { cropId } = req.params;
    const { district } = req.query;

    // Get crop details
    const crop = await Crop.findByPk(cropId);
    if (!crop) {
      return res.status(404).json({
        error: 'Crop not found',
        message: 'The specified crop does not exist'
      });
    }

    // Get latest predictions
    const whereClause = { crop_id: cropId };
    if (district) whereClause.district = district;

    const predictions = await PricePrediction.findAll({
      where: whereClause,
      order: [['prediction_date', 'DESC']],
      limit: 30 // Last 30 days
    });

    res.json({
      message: 'Price predictions retrieved successfully',
      data: {
        crop: {
          id: crop.id,
          name: crop.crop_name,
          name_tamil: crop.crop_name_tamil,
          category: crop.category
        },
        predictions
      }
    });

  } catch (error) {
    console.error('Price predictions retrieval error:', error);
    res.status(500).json({
      error: 'Price predictions retrieval failed',
      message: 'An error occurred while retrieving price predictions'
    });
  }
});

// Get price history for a crop
router.get('/price-history/:cropId', authenticateToken, async (req, res) => {
  try {
    const { cropId } = req.params;
    const { district, days = 30 } = req.query;

    // Get crop details
    const crop = await Crop.findByPk(cropId);
    if (!crop) {
      return res.status(404).json({
        error: 'Crop not found',
        message: 'The specified crop does not exist'
      });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get price history
    const whereClause = {
      crop_id: cropId,
      date: {
        [Op.between]: [startDate, endDate]
      }
    };
    if (district) whereClause.district = district;

    const priceHistory = await PriceHistory.findAll({
      where: whereClause,
      order: [['date', 'ASC']]
    });

    res.json({
      message: 'Price history retrieved successfully',
      data: {
        crop: {
          id: crop.id,
          name: crop.crop_name,
          name_tamil: crop.crop_name_tamil,
          category: crop.category
        },
        price_history: priceHistory
      }
    });

  } catch (error) {
    console.error('Price history retrieval error:', error);
    res.status(500).json({
      error: 'Price history retrieval failed',
      message: 'An error occurred while retrieving price history'
    });
  }
});

// Get crop recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const { district, season } = req.query;

    if (!district) {
      return res.status(400).json({
        error: 'District required',
        message: 'District parameter is required for crop recommendations'
      });
    }

    // Call ML API for recommendations
    try {
      const mlResponse = await axios.post(`${process.env.ML_API_URL}/recommendations`, {
        district,
        season,
        user_type: req.user.user_type
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.ML_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      res.json({
        message: 'Crop recommendations retrieved successfully',
        data: mlResponse.data
      });

    } catch (mlError) {
      console.error('ML API error:', mlError);
      
      // Fallback to database-based recommendations
      const currentSeason = season || getCurrentSeason();
      const recommendedCrops = await Crop.findAll({
        where: {
          typical_districts: {
            [Op.contains]: [district]
          },
          harvest_season: currentSeason,
          is_active: true
        },
        limit: 10
      });

      res.json({
        message: 'Crop recommendations retrieved successfully (fallback)',
        data: {
          recommendations: recommendedCrops,
          source: 'database_fallback'
        }
      });
    }

  } catch (error) {
    console.error('Crop recommendations error:', error);
    res.status(500).json({
      error: 'Crop recommendations failed',
      message: 'An error occurred while retrieving crop recommendations'
    });
  }
});

// Get market analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { district, crop_id, days = 30 } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get analytics data
    const whereClause = {
      date: {
        [Op.between]: [startDate, endDate]
      }
    };
    if (district) whereClause.district = district;
    if (crop_id) whereClause.crop_id = crop_id;

    // Get price trends
    const priceData = await PriceHistory.findAll({
      where: whereClause,
      include: [
        {
          model: Crop,
          as: 'crop',
          attributes: ['id', 'crop_name', 'crop_name_tamil', 'category']
        }
      ],
      order: [['date', 'ASC']]
    });

    // Calculate statistics
    const stats = calculatePriceStats(priceData);

    res.json({
      message: 'Market analytics retrieved successfully',
      data: {
        period: {
          start_date: startDate,
          end_date: endDate,
          days: parseInt(days)
        },
        statistics: stats,
        price_trends: priceData
      }
    });

  } catch (error) {
    console.error('Market analytics error:', error);
    res.status(500).json({
      error: 'Market analytics failed',
      message: 'An error occurred while retrieving market analytics'
    });
  }
});

// Generate price prediction
router.post('/predict-price', authenticateToken, async (req, res) => {
  try {
    const { crop_id, district, prediction_date } = req.body;

    if (!crop_id || !district) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Crop ID and district are required'
      });
    }

    // Call ML API for price prediction
    try {
      const mlResponse = await axios.post(`${process.env.ML_API_URL}/predict-price`, {
        crop_id,
        district,
        prediction_date: prediction_date || new Date().toISOString()
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.ML_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      // Save prediction to database
      const prediction = await PricePrediction.create({
        crop_id,
        district,
        predicted_price: mlResponse.data.predicted_price,
        confidence_score: mlResponse.data.confidence_score,
        prediction_date: prediction_date || new Date(),
        model_version: mlResponse.data.model_version || '1.0'
      });

      res.json({
        message: 'Price prediction generated successfully',
        data: prediction
      });

    } catch (mlError) {
      console.error('ML API error:', mlError);
      
      // Fallback to simple prediction based on historical data
      const historicalData = await PriceHistory.findAll({
        where: { crop_id, district },
        order: [['date', 'DESC']],
        limit: 30
      });

      if (historicalData.length === 0) {
        return res.status(404).json({
          error: 'Insufficient data',
          message: 'Not enough historical data for price prediction'
        });
      }

      const avgPrice = historicalData.reduce((sum, record) => sum + parseFloat(record.price_per_kg), 0) / historicalData.length;
      const prediction = await PricePrediction.create({
        crop_id,
        district,
        predicted_price: avgPrice,
        confidence_score: 0.5, // Low confidence for fallback
        prediction_date: prediction_date || new Date(),
        model_version: 'fallback'
      });

      res.json({
        message: 'Price prediction generated successfully (fallback)',
        data: prediction
      });
    }

  } catch (error) {
    console.error('Price prediction error:', error);
    res.status(500).json({
      error: 'Price prediction failed',
      message: 'An error occurred while generating price prediction'
    });
  }
});

// Helper functions
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 9) return 'monsoon';
  if (month >= 10 && month <= 12) return 'winter';
  if (month >= 1 && month <= 3) return 'summer';
  return 'spring';
}

function calculatePriceStats(priceData) {
  if (priceData.length === 0) {
    return {
      average_price: 0,
      min_price: 0,
      max_price: 0,
      price_change: 0,
      trend: 'stable'
    };
  }

  const prices = priceData.map(record => parseFloat(record.price_per_kg));
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  let trend = 'stable';
  if (priceChange > 5) trend = 'increasing';
  else if (priceChange < -5) trend = 'decreasing';

  return {
    average_price: Math.round(averagePrice * 100) / 100,
    min_price: Math.round(minPrice * 100) / 100,
    max_price: Math.round(maxPrice * 100) / 100,
    price_change: Math.round(priceChange * 100) / 100,
    trend
  };
}

module.exports = router;

