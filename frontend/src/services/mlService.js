// ML/AI Service for Direct AgriConnect TN
import { mlAPI } from './api';

class MLService {
  // Get price predictions for a specific crop
  async getPricePredictions(cropId, district = null) {
    try {
      const params = district ? { district } : {};
      const response = await mlAPI.getPricePredictions(cropId, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching price predictions:', error);
      throw error;
    }
  }

  // Get price history for trend analysis
  async getPriceHistory(cropId, district = null, days = 30) {
    try {
      const params = { days };
      if (district) params.district = district;
      
      const response = await mlAPI.getPriceHistory(cropId, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }

  // Get crop recommendations based on location and season
  async getCropRecommendations(district, season = null, userType = 'farmer') {
    try {
      const params = { district, user_type: userType };
      if (season) params.season = season;
      
      const response = await mlAPI.getCropRecommendations(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
      throw error;
    }
  }

  // Get market analytics and insights
  async getMarketAnalytics(district = null, cropId = null, days = 30) {
    try {
      const params = { days };
      if (district) params.district = district;
      if (cropId) params.crop_id = cropId;
      
      const response = await mlAPI.getMarketAnalytics(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching market analytics:', error);
      throw error;
    }
  }

  // Generate price prediction for a specific crop and district
  async generatePricePrediction(cropId, district, predictionDate = null) {
    try {
      const predictionData = {
        crop_id: cropId,
        district,
        prediction_date: predictionDate || new Date().toISOString()
      };
      
      const response = await mlAPI.generatePricePrediction(predictionData);
      return response.data;
    } catch (error) {
      console.error('Error generating price prediction:', error);
      throw error;
    }
  }

  // Analyze price trends and provide insights
  analyzePriceTrends(priceHistory) {
    if (!priceHistory || priceHistory.length === 0) {
      return {
        trend: 'stable',
        change: 0,
        volatility: 0,
        recommendation: 'Insufficient data for analysis'
      };
    }

    const prices = priceHistory.map(record => record.price_per_kg);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Calculate volatility (standard deviation)
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance);

    // Determine trend
    let trend = 'stable';
    if (change > 5) trend = 'increasing';
    else if (change < -5) trend = 'decreasing';

    // Generate recommendation
    let recommendation = '';
    if (trend === 'increasing') {
      recommendation = 'Prices are rising. Consider selling soon for better returns.';
    } else if (trend === 'decreasing') {
      recommendation = 'Prices are falling. Consider holding or finding alternative markets.';
    } else {
      recommendation = 'Prices are stable. Monitor market conditions for optimal timing.';
    }

    return {
      trend,
      change: Math.round(change * 100) / 100,
      volatility: Math.round(volatility * 100) / 100,
      recommendation,
      averagePrice: Math.round(mean * 100) / 100,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices)
    };
  }

  // Get seasonal crop recommendations for Tamil Nadu
  getSeasonalRecommendations() {
    const currentMonth = new Date().getMonth() + 1;
    
    const seasons = {
      'kharif': [6, 7, 8, 9], // June to September
      'rabi': [10, 11, 12, 1], // October to January
      'zaid': [2, 3, 4, 5] // February to May
    };

    let currentSeason = 'zaid';
    for (const [season, months] of Object.entries(seasons)) {
      if (months.includes(currentMonth)) {
        currentSeason = season;
        break;
      }
    }

    const recommendations = {
      'kharif': [
        { crop: 'Rice', tamil: 'அரிசி', districts: ['Thanjavur', 'Madurai', 'Trichy'] },
        { crop: 'Sugarcane', tamil: 'கரும்பு', districts: ['Coimbatore', 'Erode', 'Salem'] },
        { crop: 'Cotton', tamil: 'பருத்தி', districts: ['Coimbatore', 'Erode'] },
        { crop: 'Groundnut', tamil: 'வேர்க்கடலை', districts: ['Vellore', 'Krishnagiri'] }
      ],
      'rabi': [
        { crop: 'Wheat', tamil: 'கோதுமை', districts: ['Vellore', 'Krishnagiri'] },
        { crop: 'Chickpea', tamil: 'கடலை', districts: ['Vellore', 'Krishnagiri'] },
        { crop: 'Mustard', tamil: 'கடுகு', districts: ['Vellore', 'Krishnagiri'] },
        { crop: 'Onion', tamil: 'வெங்காயம்', districts: ['Coimbatore', 'Erode'] }
      ],
      'zaid': [
        { crop: 'Vegetables', tamil: 'காய்கறிகள்', districts: ['All'] },
        { crop: 'Fruits', tamil: 'பழங்கள்', districts: ['All'] },
        { crop: 'Spices', tamil: 'மசாலாப் பொருட்கள்', districts: ['Erode', 'Salem'] },
        { crop: 'Medicinal Plants', tamil: 'மருத்துவ தாவரங்கள்', districts: ['Erode', 'Salem'] }
      ]
    };

    return {
      currentSeason,
      recommendations: recommendations[currentSeason],
      seasonInfo: {
        'kharif': 'Monsoon season - June to September',
        'rabi': 'Winter season - October to January', 
        'zaid': 'Summer season - February to May'
      }
    };
  }

  // Calculate optimal selling price based on market conditions
  calculateOptimalPrice(currentPrice, marketTrend, volatility, demandLevel) {
    let adjustmentFactor = 1;
    
    // Adjust based on trend
    if (marketTrend === 'increasing') {
      adjustmentFactor += 0.05; // 5% increase
    } else if (marketTrend === 'decreasing') {
      adjustmentFactor -= 0.05; // 5% decrease
    }
    
    // Adjust based on volatility
    if (volatility > 20) {
      adjustmentFactor += 0.02; // 2% increase for high volatility
    }
    
    // Adjust based on demand
    if (demandLevel === 'high') {
      adjustmentFactor += 0.08; // 8% increase
    } else if (demandLevel === 'low') {
      adjustmentFactor -= 0.05; // 5% decrease
    }
    
    const optimalPrice = currentPrice * adjustmentFactor;
    
    return {
      optimalPrice: Math.round(optimalPrice * 100) / 100,
      adjustmentFactor: Math.round(adjustmentFactor * 100) / 100,
      recommendation: this.getPriceRecommendation(adjustmentFactor)
    };
  }

  getPriceRecommendation(adjustmentFactor) {
    if (adjustmentFactor > 1.1) {
      return 'Strong market conditions. Consider premium pricing.';
    } else if (adjustmentFactor > 1.05) {
      return 'Good market conditions. Slight premium possible.';
    } else if (adjustmentFactor < 0.95) {
      return 'Challenging market conditions. Consider competitive pricing.';
    } else {
      return 'Stable market conditions. Standard pricing recommended.';
    }
  }

  // Get weather-based crop advisories
  getWeatherAdvisory(district, currentWeather) {
    const advisories = {
      'rainy': {
        'Rice': 'Monitor water levels. Ensure proper drainage.',
        'Sugarcane': 'Good for growth. Watch for waterlogging.',
        'Cotton': 'Risk of fungal diseases. Apply fungicides.',
        'Vegetables': 'Harvest before heavy rains. Store properly.'
      },
      'dry': {
        'Rice': 'Increase irrigation frequency.',
        'Sugarcane': 'Monitor soil moisture. Irrigate as needed.',
        'Cotton': 'Good conditions for flowering.',
        'Vegetables': 'Increase watering. Use mulch for moisture retention.'
      },
      'hot': {
        'Rice': 'Increase irrigation. Monitor for heat stress.',
        'Sugarcane': 'Good for growth. Monitor for pests.',
        'Cotton': 'Optimal conditions for boll development.',
        'Vegetables': 'Provide shade. Increase watering frequency.'
      }
    };

    return advisories[currentWeather] || {};
  }

  // Format data for charts
  formatChartData(priceHistory, type = 'line') {
    if (!priceHistory || priceHistory.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = priceHistory.map(record => 
      new Date(record.date).toLocaleDateString()
    );
    
    const prices = priceHistory.map(record => record.price_per_kg);
    
    return {
      labels,
      datasets: [{
        label: 'Price per Kg (₹)',
        data: prices,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }
}

// Create singleton instance
const mlService = new MLService();
export default mlService;
