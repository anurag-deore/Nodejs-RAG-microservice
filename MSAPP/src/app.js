require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./config/logger');
const redis = require('./config/redis');
const upload = require('./middleware/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileMetadata = {
      filename: req.file.filename,
      path: path.resolve(req.file.path),
      timestamp: new Date().toISOString()
    };

    // Publish event to Redis
    await redis.publish('file_uploaded', JSON.stringify(fileMetadata));

    logger.info('File uploaded successfully', fileMetadata);

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename
    });
  } catch (error) {
    logger.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Application error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app; 