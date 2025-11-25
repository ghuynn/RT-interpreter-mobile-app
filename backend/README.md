# RT-interpreter-mobile-app Backend

Backend API for Real-time Interpreter mobile application built with Node.js, Express, and MongoDB.

## 📦 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## 🛠️ Installation

### 1. Install dependencies

    cd backend
    npm install

### 2. Configure environment variables

The backend automatically loads environment variables from the root `.env` file. Ensure your root `.env` contains:

    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
    PORT=3000

### 3. Start the server

Development mode with auto-reload
    
    npm run dev

Production mode

    npm start

The server will start on the port specified in your `.env` file (default: 3000).

## 🌐 API Endpoints

### Health Check
- `GET /api/health` – Check server status

### Translations
- `POST /api/translations` – Save new translation
- `GET /api/translations` – Get translation history with pagination
- `GET /api/translations/:id` – Get specific translation by ID
- `DELETE /api/translations/:id` – Delete specific translation
- `DELETE /api/translations/user/:userId` – Delete all translations for a user

## 📊 Data Structure

### Translation Schema

    {
    _id: String, // Object ID
    originalText: String, // Original text
    translatedText: String, // Translated text
    sourceLanguage: String, // Source language (default: 'auto')
    targetLanguage: String, // Target language
    translationMethod: String, // 'voice' or 'manual'
    userId: String // User ID (default: 'anonymous')
    timestamp: Date, // Creation timestamp
    __v: version key // MongooseDB
    }

## 💡 Usage Examples

### Save a translation

    POST /api/translations
    Content-Type: application/json

    
    _id:ObjectId('68f7bc3f37fc0301f339101f¨')
    originalText: "Moikka, nimeni on Huy"
    translatedText: "Hei, ilo tutustua Huy!"
    sourceLanguage: "auto"
    targetLanguage: "vi"
    translationMethod: "manual"
    userId: "anonymous"
    timestamp: 2025-10-21T17:00:47.906+00:00
    __v: 0

### Get translation history

    GET /api/translations?userId=anonymous&limit=50&page=1

**Response:**

    {
    "translations": [...],
    "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
    }
    }

## 🔗 Frontend Integration

The React Native frontend connects to this API at:

- **Development:** `http://localhost:3000/api`
- **Production:** Configure the base URL in `frontend/src/api.ts`

Make sure the backend server is running before starting the mobile app.

## 📂 Project Structure

    backend/
    ├── routes/
    │ ├── config.js # Environment configuration
    │ ├── translations.js # Translation routes
    │ └── health.js # Health check routes
    ├── models/
    │ └── Translation.js # MongoDB schema
    ├── server.js # Express server entry point
    └── package.json

## ⚠️ Error Handling

All endpoints return consistent error responses:

    {
    "error": "Error message description"
    }

**Common status codes:**
- `200` – Success
- `201` – Created
- `400` – Bad Request
- `404` – Not Found
- `500` – Server Error