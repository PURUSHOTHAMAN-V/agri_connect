import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import mlService from '../../services/mlService';

const CropRecommendation = ({ userDistrict, userType = 'farmer' }) => {
  const { t, language } = useLanguage();
  const [recommendations, setRecommendations] = useState(null);
  const [seasonalInfo, setSeasonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    loadSeasonalInfo();
  }, [userDistrict, userType]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await mlService.getCropRecommendations(userDistrict, selectedSeason, userType);
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load crop recommendations');
    } finally {
      setLoading(false);
    }
  };

  const loadSeasonalInfo = () => {
    const seasonalData = mlService.getSeasonalRecommendations();
    setSeasonalInfo(seasonalData);
    setSelectedSeason(seasonalData.currentSeason);
  };

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    fetchRecommendations();
  };

  const renderSeasonalInfo = () => {
    if (!seasonalInfo) return null;

    return (
      <div className="card">
        <h3 className="mb-4">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'பருவகால பரிந்துரைகள்' : 'Seasonal Recommendations'}
          </span>
        </h3>
        
        <div className="mb-4">
          <div className="d-flex gap-2 mb-3">
            {Object.keys(seasonalInfo.seasonInfo).map(season => (
              <button
                key={season}
                onClick={() => handleSeasonChange(season)}
                className={`btn ${selectedSeason === season ? 'btn-primary' : 'btn-outline'}`}
              >
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 
                    (season === 'kharif' ? 'கார்ப்பு' : 
                     season === 'rabi' ? 'ராபி' : 'சாயிட்') : 
                    season.charAt(0).toUpperCase() + season.slice(1)
                  }
                </span>
              </button>
            ))}
          </div>
          
          <div className="text-secondary">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {language === 'tamil' ? 
                `தற்போதைய பருவம்: ${seasonalInfo.seasonInfo[selectedSeason]}` :
                `Current Season: ${seasonalInfo.seasonInfo[selectedSeason]}`
              }
            </span>
          </div>
        </div>

        <div className="grid grid-2 gap-3">
          {seasonalInfo.recommendations.map((crop, index) => (
            <div key={index} className="card">
              <div className="d-flex justify-between align-start">
                <div>
                  <h5 className="mb-2">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {crop.tamil}
                    </span>
                  </h5>
                  <p className="text-secondary text-sm mb-1">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {crop.crop}
                    </span>
                  </p>
                  <p className="text-secondary text-sm">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {language === 'tamil' ? 'மாவட்டங்கள்' : 'Districts'}: {crop.districts.join(', ')}
                    </span>
                  </p>
                </div>
                <div className="text-primary">
                  🌱
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMLRecommendations = () => {
    if (!recommendations?.recommendations) return null;

    return (
      <div className="card">
        <h3 className="mb-4">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'AI பயிர் பரிந்துரைகள்' : 'AI Crop Recommendations'}
          </span>
        </h3>
        
        <div className="space-y-3">
          {recommendations.recommendations.map((recommendation, index) => (
            <div key={index} className="card">
              <div className="d-flex justify-between align-start">
                <div className="flex-1">
                  <h5 className="mb-2">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {recommendation.crop_name_tamil || recommendation.crop_name}
                    </span>
                  </h5>
                  
                  <div className="mb-3">
                    <div className="d-flex align-center mb-2">
                      <span className="text-secondary text-sm mr-2">
                        <span className={language === 'tamil' ? 'tamil' : ''}>
                          {language === 'tamil' ? 'நம்பிக்கை' : 'Confidence'}
                        </span>
                      </span>
                      <div className="progress-bar" style={{ width: '100px', height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                        <div 
                          className="bg-primary" 
                          style={{ 
                            width: `${recommendation.confidence_score * 100}%`, 
                            height: '100%', 
                            borderRadius: '4px' 
                          }}
                        ></div>
                      </div>
                      <span className="text-secondary text-sm ml-2">
                        {Math.round(recommendation.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>

                  {recommendation.reasons && (
                    <div className="mb-3">
                      <h6 className="mb-2">
                        <span className={language === 'tamil' ? 'tamil' : ''}>
                          {language === 'tamil' ? 'காரணங்கள்' : 'Reasons'}
                        </span>
                      </h6>
                      <ul className="text-secondary text-sm">
                        {recommendation.reasons.map((reason, reasonIndex) => (
                          <li key={reasonIndex}>
                            <span className={language === 'tamil' ? 'tamil' : ''}>
                              {reason}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-2 gap-2">
                    {recommendation.expected_yield && (
                      <div>
                        <span className="text-secondary text-sm">
                          <span className={language === 'tamil' ? 'tamil' : ''}>
                            {language === 'tamil' ? 'எதிர்பார்க்கப்படும் விளைச்சல்' : 'Expected Yield'}
                          </span>
                        </span>
                        <div className="text-primary">
                          {recommendation.expected_yield} kg/acre
                        </div>
                      </div>
                    )}
                    
                    {recommendation.market_demand && (
                      <div>
                        <span className="text-secondary text-sm">
                          <span className={language === 'tamil' ? 'tamil' : ''}>
                            {language === 'tamil' ? 'சந்தை தேவை' : 'Market Demand'}
                          </span>
                        </span>
                        <div className="text-success">
                          {recommendation.market_demand > 0.7 ? 'High' : 
                           recommendation.market_demand > 0.4 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-primary text-lg">
                    {Math.round(recommendation.confidence_score * 100)}%
                  </div>
                  <div className="text-secondary text-sm">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {language === 'tamil' ? 'பரிந்துரை' : 'Recommendation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeatherAdvisory = () => {
    const currentWeather = 'rainy'; // This would come from weather API
    const advisories = mlService.getWeatherAdvisory(userDistrict, currentWeather);

    return (
      <div className="card">
        <h3 className="mb-4">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'வானிலை அறிவுறுத்தல்' : 'Weather Advisory'}
          </span>
        </h3>
        
        <div className="mb-3">
          <div className="d-flex align-center mb-2">
            <span className="text-info mr-2">🌧️</span>
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {language === 'tamil' ? 'தற்போதைய வானிலை: மழை' : 'Current Weather: Rainy'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {Object.entries(advisories).map(([crop, advisory]) => (
            <div key={crop} className="d-flex justify-between align-start p-2 border-bottom">
              <div>
                <h6 className="mb-1">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {crop}
                  </span>
                </h6>
                <p className="text-secondary text-sm">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {advisory}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
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
      {renderSeasonalInfo()}
      {renderMLRecommendations()}
      {renderWeatherAdvisory()}
    </div>
  );
};

export default CropRecommendation;
