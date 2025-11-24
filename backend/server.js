const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const translationRoutes = require('./routes/translations');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
// Simple request logging to terminal
app.use((req, res, next) => {
  const startedAt = Date.now();
  console.log(`[REQ] ${req.method} ${req.originalUrl} from ${req.ip}`);
  res.on('finish', () => {
    const ms = Date.now() - startedAt;
    console.log(`[RES] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// Routes
app.use('/api/translations', translationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AppDich Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Diagnostics endpoint to verify device reachability and headers
app.get('/api/debug/echo', (req, res) => {
  res.json({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers
  });
});

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  console.log('⚠️  Server will continue running without database (translations won\'t be saved)');
  console.log('💡 To fix: Add your IP to MongoDB Atlas whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/');
});

// Start server
const PORT = config.PORT;
app.listen(PORT, '0.0.0.0', () => {  // ← Add '0.0.0.0' here
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Translations API: http://localhost:${PORT}/api/translations`);
  
  // Add network IP info
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  console.log(`\n📱 For mobile device, use: <http://${addresses>[0] || 'YOUR_IP'}:${PORT}/api/health\n`);
});

module.exports = app;


