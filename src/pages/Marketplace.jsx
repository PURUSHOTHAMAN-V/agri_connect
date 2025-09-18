import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/common/Header.jsx';
import ProductCard from '../components/marketplace/ProductCard.jsx';
import ProductDetails from '../components/marketplace/ProductDetails.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import { districts, cropTypes, grades } from '../utils/languages.js';

const Marketplace = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatProduct, setChatProduct] = useState(null);
  const [chatUser, setChatUser] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCropType, setSelectedCropType] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('relevance');

  // Mock products data - replace with API call
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: language === 'tamil' ? 'பொன்னி அரிசி' : 'Ponni Rice',
        farmer: language === 'tamil' ? 'குமார் விவசாயி' : 'Kumar Farmer',
        farmerId: 'farmer1',
        district: 'Thanjavur',
        cropType: 'rice',
        variety: 'Ponni',
        grade: 'A',
        quantity: 100,
        unit: 'quintal',
        price: 2500,
        harvestDate: '2025-01-15',
        deliveryWindow: '7 days',
        description: language === 'tamil' ? 'உயர்ந்த தரமான பொன்னி அரிசி, நல்ல சுவை மற்றும் நிறம்' : 'High quality Ponni rice with good taste and color',
        rating: 4.5,
        images: []
      },
      {
        id: 2,
        name: language === 'tamil' ? 'கரும்பு' : 'Sugarcane',
        farmer: language === 'tamil' ? 'ராஜா விவசாயி' : 'Raja Farmer',
        farmerId: 'farmer2',
        district: 'Madurai',
        cropType: 'sugarcane',
        variety: 'Co 86032',
        grade: 'B',
        quantity: 50,
        unit: 'quintal',
        price: 1800,
        harvestDate: '2025-01-20',
        deliveryWindow: '3 days',
        description: language === 'tamil' ? 'இனிப்பான கரும்பு, சர்க்கரை உற்பத்திக்கு ஏற்றது' : 'Sweet sugarcane suitable for sugar production',
        rating: 4.2,
        images: []
      },
      {
        id: 3,
        name: language === 'tamil' ? 'மஞ்சள்' : 'Turmeric',
        farmer: language === 'tamil' ? 'செல்வி விவசாயி' : 'Selvi Farmer',
        farmerId: 'farmer3',
        district: 'Erode',
        cropType: 'turmeric',
        variety: 'Salem',
        grade: 'A',
        quantity: 25,
        unit: 'quintal',
        price: 12000,
        harvestDate: '2025-01-10',
        deliveryWindow: '15 days',
        description: language === 'tamil' ? 'உயர்ந்த தரமான மஞ்சள், மருத்துவ பண்புகள் கொண்டது' : 'High quality turmeric with medicinal properties',
        rating: 4.8,
        images: []
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, [language]);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.variety.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // District filter
    if (selectedDistrict) {
      filtered = filtered.filter(product => product.district === selectedDistrict);
    }

    // Crop type filter
    if (selectedCropType) {
      filtered = filtered.filter(product => product.cropType === selectedCropType);
    }

    // Grade filter
    if (selectedGrade) {
      filtered = filtered.filter(product => product.grade === selectedGrade);
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const price = product.price;
        const min = priceRange.min ? parseInt(priceRange.min) : 0;
        const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedDistrict, selectedCropType, selectedGrade, priceRange, sortBy]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOrder = (orderData) => {
    // Handle order placement
    console.log('Order placed:', orderData);
    alert(language === 'tamil' ? 'ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!' : 'Order placed successfully!');
  };

  const handleChat = (product) => {
    setChatProduct(product);
    setChatUser({
      id: product.farmerId,
      name: product.farmer
    });
    setIsChatOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedCropType('');
    setSelectedGrade('');
    setPriceRange({ min: '', max: '' });
    setSortBy('relevance');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Header />
        <div className="container py-4">
          <div className="d-flex justify-center align-center" style={{ minHeight: '50vh' }}>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Header />
      
      <main className="container py-4">
        {/* Page Header */}
        <div className="card mb-4">
          <div className="d-flex justify-between align-center">
            <div>
              <h2 className="mb-2">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'சந்தை இடம்' : 'Marketplace'}
                </span>
              </h2>
              <p className="text-secondary mb-0">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil'
                    ? 'நேரடியாக விவசாயிகளிடமிருந்து வாங்கவும்'
                    : 'Buy directly from farmers'
                  }
                </span>
              </p>
            </div>
            <div className="text-primary" style={{ fontSize: '3rem' }}>🛒</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="d-flex justify-between align-center mb-3">
            <h4>
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'வடிப்பான்கள்' : 'Filters'}
              </span>
            </h4>
            <button onClick={clearFilters} className="btn btn-outline btn-small">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'அனைத்தையும் அழிக்கவும்' : 'Clear All'}
              </span>
            </button>
          </div>

          <div className="grid grid-4 gap-3">
            {/* Search */}
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('search')}
                </span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                placeholder={language === 'tamil' ? 'பொருள், விவசாயி அல்லது வகை' : 'Product, farmer or variety'}
              />
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('district')}
                </span>
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="form-select"
              >
                <option value="">
                  {language === 'tamil' ? 'அனைத்து மாவட்டங்களும்' : 'All districts'}
                </option>
                {districts.map(district => (
                  <option key={district.id} value={district.name[language]}>
                    {district.name[language]}
                  </option>
                ))}
              </select>
            </div>

            {/* Crop Type */}
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('cropType')}
                </span>
              </label>
              <select
                value={selectedCropType}
                onChange={(e) => setSelectedCropType(e.target.value)}
                className="form-select"
              >
                <option value="">
                  {language === 'tamil' ? 'அனைத்து பயிர்களும்' : 'All crops'}
                </option>
                {cropTypes.map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name[language]}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('grade')}
                </span>
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="form-select"
              >
                <option value="">
                  {language === 'tamil' ? 'அனைத்து தரங்களும்' : 'All grades'}
                </option>
                {grades.map(grade => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name[language]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="row mt-3">
            <div className="col">
              <div className="form-group">
                <label className="form-label">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'குறைந்த விலை' : 'Min Price'}
                  </span>
                </label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="form-input"
                  placeholder="₹"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label className="form-label">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'அதிக விலை' : 'Max Price'}
                  </span>
                </label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="form-input"
                  placeholder="₹"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label className="form-label">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'வரிசைப்படுத்து' : 'Sort By'}
                  </span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                >
                  <option value="relevance">
                    {language === 'tamil' ? 'பொருத்தம்' : 'Relevance'}
                  </option>
                  <option value="price-low">
                    {language === 'tamil' ? 'விலை: குறைந்தது முதல்' : 'Price: Low to High'}
                  </option>
                  <option value="price-high">
                    {language === 'tamil' ? 'விலை: அதிகம் முதல்' : 'Price: High to Low'}
                  </option>
                  <option value="rating">
                    {language === 'tamil' ? 'மதிப்பீடு' : 'Rating'}
                  </option>
                  <option value="recent">
                    {language === 'tamil' ? 'சமீபத்திய' : 'Recent'}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="d-flex justify-between align-center mb-4">
          <h4>
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {language === 'tamil' ? 'முடிவுகள்' : 'Results'}
            </span>
            <span className="text-secondary ml-2">
              ({filteredProducts.length} {language === 'tamil' ? 'பொருட்கள்' : 'products'})
            </span>
          </h4>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="card text-center py-5">
            <div className="mb-3" style={{ fontSize: '3rem' }}>🔍</div>
            <h4>
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'பொருட்கள் எதுவும் கிடைக்கவில்லை' : 'No products found'}
              </span>
            </h4>
            <p className="text-secondary">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil'
                  ? 'உங்கள் வடிப்பான்களை மாற்றி முயற்சிக்கவும்'
                  : 'Try adjusting your filters'
                }
              </span>
            </p>
          </div>
        ) : (
          <div className="grid grid-3 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={handleOrder}
                onChat={handleChat}
              />
            ))}
          </div>
        )}
      </main>

      {/* Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onOrder={handleOrder}
        onChat={handleChat}
      />

      {/* Chat Window */}
      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatProduct(null);
          setChatUser(null);
        }}
        otherUser={chatUser}
        product={chatProduct}
      />
    </div>
  );
};

export default Marketplace;

