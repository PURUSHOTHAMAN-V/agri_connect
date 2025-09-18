# Direct AgriConnect TN

A digital marketplace connecting farmers and buyers in Tamil Nadu, eliminating middlemen and providing fair pricing with Tamil language support.

## 🌾 Project Overview

Direct AgriConnect TN is a comprehensive web application designed to bridge the gap between farmers and buyers in Tamil Nadu. The platform eliminates middlemen, provides transparent pricing, and supports both Tamil and English languages to ensure accessibility for rural users.

## ✨ Key Features

### 🔐 Authentication & User Management
- **Dual Registration**: Separate flows for Farmers and Buyers
- **Verification**: Aadhar/Patta integration placeholders
- **User Profiles**: Complete profile management
- **Role-based Access**: Different dashboards for farmers vs buyers

### 📦 Product Management
- **Farmer Product Listing**: 
  - Crop variety selection (Rice, Sugarcane, Turmeric, Vegetables, Millets)
  - Grade selection (A, B, C grades)
  - Quantity input (quintal/kg)
  - Price per unit setting
  - Delivery window selection
  - Image upload capability
- **Product Catalog**: Browse all available products
- **Search & Filter**: By location, crop type, price range, availability

### 🗺️ Location & Mapping Features
- **Geo-tagging**: Location-based product listings
- **District-wise Filtering**: Tamil Nadu districts (Thanjavur, Madurai, Erode, etc.)
- **Nearby Markets**: Show local markets and farmers
- **Transport Suggestions**: Route planning interface

### 💬 Communication & Negotiation
- **In-app Chat**: Real-time messaging between farmers and buyers
- **Negotiation Tools**: Price negotiation interface
- **Tamil Language Support**: Chat in Tamil with pre-set templates
- **Notification System**: Order updates and messages

### 📋 Contract & Transaction Management
- **Digital Contracts**: Contract creation and management
- **Order Tracking**: From placement to delivery
- **Payment Integration**: UPI payment interface (placeholder)
- **Transaction History**: Complete transaction records

### 📊 Market Intelligence
- **Price Trends**: Interactive charts for crop prices
- **Crop Calendar**: Sowing and harvesting schedules for TN districts
- **Market Updates**: Government scheme notifications
- **MSP Information**: Minimum Support Price displays

### 🏛️ Government Integration (UI/UX)
- **Scheme Updates**: Tamil Nadu agricultural schemes
- **Procurement Information**: Government buying programs
- **Disaster Notifications**: Weather and disaster alerts

## 🎨 Design Principles

- **Clean & Intuitive**: Simple navigation for rural users
- **Tamil-First**: Primary language should be Tamil with English toggle
- **High Contrast**: Readable in bright outdoor conditions
- **Large Touch Targets**: Easy mobile interaction
- **Visual Hierarchy**: Clear information architecture

## 🎨 Color Scheme

- **Primary**: Deep Green (#2E7D32) - representing agriculture
- **Secondary**: Saffron/Orange (#FF9800) - Tamil Nadu cultural color
- **Accent**: Blue (#1976D2) - trust and technology
- **Success**: Light Green (#4CAF50)
- **Warning**: Amber (#FFC107)
- **Neutral**: Grey shades for backgrounds

## 🛠️ Technology Stack

- **Frontend Framework**: React.js (JavaScript)
- **Styling**: Regular CSS (no Tailwind or CSS frameworks)
- **Language Support**: Tamil and English
- **Responsive Design**: Mobile-first approach
- **Build Tool**: Vite
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.js
│   │   ├── LanguageToggle.js
│   │   ├── Loading.js
│   │   └── Modal.js
│   ├── auth/
│   │   ├── Login.js
│   │   └── Register.js
│   ├── farmer/
│   │   └── FarmerDashboard.js
│   ├── buyer/
│   │   └── BuyerDashboard.js
│   ├── marketplace/
│   ├── chat/
│   └── ...
├── contexts/
│   ├── LanguageContext.js
│   └── AuthContext.js
├── pages/
│   └── LandingPage.js
├── utils/
│   └── languages.js
├── styles/
│   └── App.css
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agri_connect
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🌐 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Language Support

The application supports both Tamil and English languages. Language preferences are stored in localStorage and persist across sessions.

### User Types

- **Farmer**: Can list products, manage orders, view market trends
- **Buyer**: Can browse products, place orders, track deliveries

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:

- Responsive grid layouts
- Touch-friendly buttons (minimum 44px)
- High contrast mode support
- Reduced motion support for accessibility
- Keyboard navigation support

## ♿ Accessibility Features

- Screen reader compatibility
- Keyboard navigation
- High contrast mode
- Large text option
- Focus indicators
- Skip to main content links

## 🧪 Testing

The application includes:

- Unit tests for components
- Integration tests for user flows
- Cross-browser compatibility
- Mobile responsiveness testing
- Tamil language rendering tests

## 📈 Performance Considerations

- Optimized images and assets for mobile data
- Lazy loading for product lists
- Pagination for large datasets
- Cached frequently accessed data
- Minimized bundle size

## 🔮 Future Enhancements

### Phase 2 (Enhanced Features)
- Chat and messaging system
- Price trends and charts
- Advanced search and filtering
- Order management system

### Phase 3 (Advanced Features)
- Payment integration UI
- Contract management
- Notification system
- Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Tamil Nadu Agricultural Department
- Local farmers and buyers for feedback
- Open source community for tools and libraries

## 📞 Support

For support and questions, please contact:
- Email: support@agriconnect.tn
- Phone: +91-XXX-XXX-XXXX

---

**Direct AgriConnect TN** - Empowering Tamil Nadu's agricultural community through digital innovation.
# agri_connect
