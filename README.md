#  Currency Converter Web Application

## Video Demo:
[https://youtu.be/cl5oHSX9AF4]
## 📋 Description

### **Overview**
The **Currency Converter Web Application** is a responsive, feature-rich tool designed to provide real-time currency conversion between 18+ global currencies, with special emphasis on proper handling of **Iranian Rial (IRR)**. Built as the final project for Harvard University's CS50x 2025 course, this application demonstrates proficiency in web development, API integration, user interface design, and problem-solving with real-world constraints.

### **The Problem & Solution**
Currency conversion tools are widely available, but most free solutions either:
1. Don't include Iranian Rial due to API restrictions
2. Format large IRR values poorly (showing decimals where inappropriate)
3. Lack regional currency support for Middle Eastern users

**My solution** addresses these issues by:
- Implementing fallback rates for currencies not available in free APIs
- Applying currency-specific formatting (no decimals for IRR, proper comma separators)
- Including relevant regional currencies (IRR, AED, SAR, RUB)
- Creating a responsive, accessible interface with both light and dark modes

---

## 🎯 Features

### **Core Conversion Capabilities**
1. **Real-time Currency Conversion**
   - Instant conversion between any supported currency pair
   - Live exchange rates updated via API with manual refresh capability
   - Automatic conversion on input change for seamless user experience

2. **Iranian Rial Special Handling**
   - **No Decimal Formatting**: IRR values display as whole numbers (42,000 instead of 42,000.00)
   - **Comma Separators**: Proper formatting for large numbers
   - **Fallback Implementation**: Sample rates provided when APIs don't include IRR

3. **User Experience Features**
   - **One-Click Currency Swap**: Quickly reverse conversion direction
   - **Conversion History**: Last 10 conversions saved in browser's localStorage
   - **Dark/Light Mode Toggle**: Reduces eye strain in different lighting conditions
   - **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### **Technical Features**
- **Offline Functionality**: Works without internet using fallback data
- **Data Persistence**: History preserved between browser sessions
- **Progressive Enhancement**: Core functionality works even if JavaScript is partially disabled
- **Accessibility**: Keyboard navigation, screen reader support, proper ARIA labels

---

## 🏗️ Architecture & Design

### **Technology Stack**
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.0 for responsive components
- **Icons**: Font Awesome 6.4.0 for consistent iconography
- **API Integration**: ExchangeRate-API v6 (free tier)
- **Data Storage**: Browser LocalStorage API
- **Styling**: Custom CSS with CSS Variables for theming
