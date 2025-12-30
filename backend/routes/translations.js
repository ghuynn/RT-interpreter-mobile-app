const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Translation = require('../models/Translation');

// ============================================
// POST - Save translation
// ============================================
router.post('/', async (req, res) => {
  try {
    const { originalText, translatedText, sourceLanguage, targetLanguage, translationMethod, userId } = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not available - translations not saved',
        data: null
      });
    }

    const translation = new Translation({
      originalText,
      translatedText,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage,
      translationMethod,
      userId: userId || 'anonymous'
    });

    await translation.save();
    res.status(201).json({
      success: true,
      message: 'Translation saved successfully',
      data: translation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving translation',
      error: error.message
    });
  }
});

// ============================================
// GET - Fetch all translations
// ============================================
router.get('/', async (req, res) => {
  try {
    const { userId = 'anonymous', limit = 50, page = 1 } = req.query;

    const translations = await Translation
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Translation.countDocuments({ userId });

    res.json({
      success: true,
      data: translations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching translations',
      error: error.message
    });
  }
});

// ============================================
// DELETE - Delete all user translations
// IMPORTANT: This MUST be BEFORE /:id route!
// ============================================
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || userId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    console.log(`[API] Deleting all translations for user: ${userId}`);

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not available',
        deletedCount: 0
      });
    }

    // Delete all translations for the user
    const result = await Translation.deleteMany({ userId });

    console.log(`[API] Successfully deleted ${result.deletedCount} translations for user: ${userId}`);

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} translations`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('[API] Error deleting user translations:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user history',
      error: error.message,
      deletedCount: 0
    });
  }
});

// ============================================
// GET - Fetch single translation by ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id);

    if (!translation) {
      return res.status(404).json({
        success: false,
        message: 'Translation not found'
      });
    }

    res.json({
      success: true,
      data: translation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching translation',
      error: error.message
    });
  }
});

// ============================================
// DELETE - Delete single translation by ID
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const translation = await Translation.findByIdAndDelete(req.params.id);

    if (!translation) {
      return res.status(404).json({
        success: false,
        message: 'Translation not found'
      });
    }

    res.json({
      success: true,
      message: 'Translation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting translation',
      error: error.message
    });
  }
});

module.exports = router;
