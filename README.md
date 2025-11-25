# 📱 Real-time Interpreter Mobile App

AI-powered mobile translator supporting 49 languages with text-to-speech and cloud history.

## ⚙️ Overview
- RT Interpreter is a cross-platform mobile app delivering instant translations via OpenAI GPT-4o-mini. Features include automatic speech synthesis, persistent cloud history, and support for 27 languages.
- Architecture: React Native frontend → Node.js/Express API → MongoDB Atlas.

## 🚀 Features

- ✅ AI Translation – OpenAI GPT-4o-mini with auto language detection.
- ✅ Text-to-Speech – Native voice synthesis with auto-speak mode.
- ✅ Cloud History – Persistent storage with pull-to-refresh.
- ✅ 49 Languages – Vietnamese, English, Finnish, Swedish, and 45+ more.
- ✅ Cross-Platform – Single codebase for iOS and Android.
- ✅ Accessible Design – Screen reader support, high contrast, large touch targets.

## 🧠 Tech Stack

- **Frontend:** React Native 0.74 - Expo 51 - TypeScript - React Navigation
- **Backend:** Node.js - Express.js - Mongoose ODM
- **Database:** MongoDB Atlas
- **AI:** OpenAI GPT-4o-mini API
- **Speech:** Expo Speech API

## 🧪 Development

### 1. Install Dependencies

    npm install
    cd backend && npm install
  
### 2. Configure 

  Create .env in root:
  
    EXPO_PUBLIC_API_BASE_URL=http://192.168.0.5:3000 your-Wifi-local-IP-address-with-port-3000
    EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key-here
    EXPO_PUBLIC_OPENAI_BASE_URL=openAI-API-link-here
    MONGODB_URI=your-MongoDB-database-link-here
    PORT=3000

### 3. Start Backend

    cd backend 
    npm run dev
  
### 4. Start Expo on another terminal

    npx expo start --clear

### 5. Scan QR code with Expo Go or press i (iOS) / a (Android)