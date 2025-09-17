const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for electron-updater requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve update files from the updates directory
app.use('/updates', express.static(path.join(__dirname, 'updates'), {
  // Cache files for 1 hour except latest.yml (immediate updates)
  setHeaders: (res, filePath) => {
    if (path.basename(filePath) === 'latest.yml') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'electron-app-updater',
    timestamp: new Date().toISOString()
  });
});

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'The requested resource was not found on this server.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'An unexpected error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`Update server running on port ${PORT}`);
  console.log(`Updates available at: http://localhost:${PORT}/updates/`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
