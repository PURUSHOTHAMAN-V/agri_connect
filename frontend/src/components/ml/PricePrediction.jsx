import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import mlService from '../../services/mlService';

const PricePrediction = ({ cropId, district }) => {
  const { t, language } = useLanguage();
  const [predictions, setPredictions] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    if (cropId) {
      fetchPriceData();
    }
  }, [cropId, district, selectedPeriod]);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch predictions, history, and analytics in parallel
      const [predictionsData, historyData, analyticsData] = await Promise.all([
        mlService.getPricePredictions(cropId, district),
        mlService.getPriceHistory(cropId, district, selectedPeriod),
        mlService.getMarketAnalytics(district, cropId, selectedPeriod)
      ]);

      setPredictions(predictionsData);
      setPriceHistory(historyData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error fetching price data:', err);
      setError('Failed to load price data');
    } finally {
      setLoading(false);
    }
  };

  const renderPriceChart = () => {
    if (!priceHistory?.price_history) return null;

    const chartData = mlService.formatChartData(priceHistory.price_history);
    const trendAnalysis = mlService.analyzePriceTrends(priceHistory.price_history);

    return (
      <div className="card">
        <h3 className="mb-4">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'விலை போக்கு' : 'Price Trend'}
          </span>
        </h3>
        
        <div className="mb-4">
          <div className="d-flex justify-between align-center mb-3">
            <h4>
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {priceHistory.crop?.crop_name_tamil || priceHistory.crop?.crop_name}
              </span>
            </h4>
            <div className="d-flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                className="form-select"
              >
                <option value={7}>
                  {language === 'tamil' ? '7 நாட்கள்' : '7 Days'}
                </option>
                <option value={30}>
                  {language === 'tamil' ? '30 நாட்கள்' : '30 Days'}
                </option>
                <option value={90}>
                  {language === 'tamil' ? '90 நாட்கள்' : '90 Days'}
                </option>
              </select>
            </div>
          </div>

          {/* Simple chart representation */}
          <div className="price-chart-container" style={{ height: '200px', background: '#f8f9fa', borderRadius: '8px', padding: '1rem' }}>
            <div className="d-flex justify-center align-center" style={{ height: '100%' }}>
              <div className="text-center">
                <div className="text-secondary mb-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'விலை வரைபடம்' : 'Price Chart'}
                  </span>
                </div>
                <div className="text-primary text-lg">
                  ₹{trendAnalysis.averagePrice?.toLocaleString()}
                </div>
                <div className="text-secondary text-sm">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'சராசரி விலை' : 'Average Price'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="grid grid-2 gap-3">
          <div className="card">
            <h5 className="mb-2">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'போக்கு' : 'Trend'}
              </span>
            </h5>
            <div className={`text-${trendAnalysis.trend === 'increasing' ? 'success' : trendAnalysis.trend === 'decreasing' ? 'error' : 'secondary'}`}>
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {trendAnalysis.trend === 'increasing' ? 'அதிகரிக்கிறது' : 
                 trendAnalysis.trend === 'decreasing' ? 'குறைகிறது' : 'நிலையானது'}
              </span>
              <span className="ml-2">
                {trendAnalysis.change > 0 ? '+' : ''}{trendAnalysis.change}%
              </span>
            </div>
          </div>

          <div className="card">
            <h5 className="mb-2">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'மாறுபாடு' : 'Volatility'}
              </span>
            </h5>
            <div className="text-secondary">
              {trendAnalysis.volatility}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPredictions = () => {
    if (!predictions?.predictions) return null;

    return (
      <div className="card">
        <h3 className="mb-4">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'விலை கணிப்புகள்' : 'Price Predictions'}
          </span>
        </h3>
        
        <div className="space-y-3">
          {predictions.predictions.slice(0, 7).map((prediction, index) => (
            <div key={index} className="d-flex justify-between align-center p-3 border-bottom">
              <div>
                <h5 className="mb-1">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {new Date(prediction.prediction_date).toLocaleDateString()}
                  </span>
                </h5>
                <p className="text-secondary mb-0">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'மாதிரி' : 'Model'}: {prediction.model_version || 'v1.0'}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <h5 className="text-primary mb-1">
                  ₹{prediction.predicted_price?.toLocaleString()}
                </h5>
                <div className="d-flex align-center">
                  <span className="text-secondary text-sm mr-2">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {language === 'tamil' ? 'நம்பிக்கை' : 'Confidence'}
                    </span>
                  </span>
                  <div className="progress-bar" style={{ width: '60px', height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                    <div 
                      className="bg-primary" 
                      style={{ 
                        width: `${prediction.confidence_score * 100}%`, 
                        height: '100%', 
                        borderRadius: '4px' 
                      }}
                    ></div>
                  </div>
                  <span className="text-secondary text-sm ml-2">
                    {Math.round(prediction.confidence_score * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMarketInsights = () => {
    if (!analytics?.statistics) return null;

    const stats = analytics.statistics;
    
    return (
      <div className="card">
        <h3 className="mb-4">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'சந்தை பகுப்பாய்வு' : 'Market Analysis'}
          </span>
        </h3>
        
        <div className="grid grid-2 gap-3">
          <div className="card">
            <h5 className="mb-2">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'சராசரி விலை' : 'Average Price'}
              </span>
            </h5>
            <div className="text-primary text-lg">
              ₹{stats.average_price?.toLocaleString()}
            </div>
          </div>

          <div className="card">
            <h5 className="mb-2">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'குறைந்த விலை' : 'Min Price'}
              </span>
            </h5>
            <div className="text-success text-lg">
              ₹{stats.min_price?.toLocaleString()}
            </div>
          </div>

          <div className="card">
            <h5 className="mb-2">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'அதிக விலை' : 'Max Price'}
              </span>
            </h5>
            <div className="text-warning text-lg">
              ₹{stats.max_price?.toLocaleString()}
            </div>
          </div>

          <div className="card">
            <h5 className="mb-2">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'விலை மாற்றம்' : 'Price Change'}
              </span>
            </h5>
            <div className={`text-${stats.trend === 'increasing' ? 'success' : stats.trend === 'decreasing' ? 'error' : 'secondary'}`}>
              {stats.price_change > 0 ? '+' : ''}{stats.price_change}%
            </div>
          </div>
        </div>

        {analytics.price_trends && (
          <div className="mt-4">
            <h5 className="mb-3">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'விலை போக்கு வரலாறு' : 'Price Trend History'}
              </span>
            </h5>
            <div className="space-y-2">
              {analytics.price_trends.slice(0, 5).map((trend, index) => (
                <div key={index} className="d-flex justify-between align-center p-2 border-bottom">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {new Date(trend.date).toLocaleDateString()}
                  </span>
                  <span className="text-primary">
                    ₹{trend.price_per_kg?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-center align-center" style={{ minHeight: '200px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center p-4">
          <div className="text-error mb-2">⚠️</div>
          <h4>
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {language === 'tamil' ? 'பிழை' : 'Error'}
            </span>
          </h4>
          <p className="text-secondary">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {error}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderPriceChart()}
      {renderPredictions()}
      {renderMarketInsights()}
    </div>
  );
};

export default PricePrediction;
