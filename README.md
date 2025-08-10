# OTT Sharing Platform

A comprehensive mobile application for sharing OTT subscriptions, managing group payments, and handling various recharges.

## Features

### Core Features
- **Group Management**: Create and manage OTT sharing groups
- **Cost Splitting**: Automatic cost calculation and splitting among members
- **Payment Integration**: Secure payments via Razorpay
- **WhatsApp Notifications**: Real-time notifications for all group activities
- **Multi-platform Support**: Netflix, Disney+ Hotstar, Amazon Prime, and more

### Additional Features
- **Comprehensive Recharge**: Mobile, DTH, Electricity, FASTag, and more
- **Group Chat**: In-app messaging with content recommendations
- **Discover Section**: Find free content across platforms
- **Wallet Management**: Group fund management for admins
- **Profile Management**: Complete user profile and preferences

## Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: StyleSheet (Native)
- **Icons**: Lucide React Native
- **Payments**: Razorpay Integration
- **Notifications**: WhatsApp Business API

## Setup Instructions

### Prerequisites
- Node.js 18+
- Expo CLI
- Razorpay Account
- WhatsApp Business API Access

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ott-sharing-platform
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
WHATSAPP_API_KEY=your_whatsapp_api_key
RECHARGE_API_KEY=your_recharge_api_key
```

4. Start the development server
```bash
npm run dev
```

## API Integration

### Razorpay Setup
1. Create a Razorpay account at https://razorpay.com
2. Get your Key ID and Secret from the dashboard
3. Add them to your environment variables
4. Configure webhooks for payment verification

### WhatsApp Business API
1. Set up WhatsApp Business API account
2. Configure message templates
3. Add API credentials to environment variables

### Recharge API
1. Integrate with a recharge service provider
2. Configure API endpoints for different services
3. Set up webhook handlers for status updates

## Deployment

### Web Deployment
```bash
npm run build:web
```

### Mobile App Deployment
1. Build for production
```bash
expo build:android
expo build:ios
```

2. Submit to app stores
```bash
expo submit:android
expo submit:ios
```

## Features Overview

### Group Management
- Create groups for different OTT platforms
- Invite members via email, phone, or WhatsApp
- Manage group settings and permissions
- Track payment status of all members

### Payment System
- Secure payment processing via Razorpay
- Multiple payment methods (UPI, Cards, Net Banking, Wallets)
- Automatic payment reminders
- Group wallet for fund management

### Notification System
- WhatsApp notifications for all group activities
- Payment reminders and confirmations
- Group invitations and updates
- Subscription renewal alerts

### Recharge Services
- Mobile recharge for all operators
- DTH/TV recharge
- Utility bill payments (Electricity, Water, Gas)
- FASTag recharge
- OTT subscription purchases

### Content Discovery
- Find free content across platforms
- Movie and TV show recommendations
- Platform-specific content suggestions
- Group content sharing and discussions

## Security Features

- End-to-end encrypted payments
- Secure credential sharing
- User authentication and authorization
- Data privacy compliance
- Fraud detection and prevention

## Support

For technical support or feature requests, please contact:
- Email: support@ottshare.com
- WhatsApp: +91-XXXXXXXXXX

## License

This project is licensed under the MIT License - see the LICENSE file for details.