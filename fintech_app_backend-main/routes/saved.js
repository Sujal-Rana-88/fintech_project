const express = require('express');
const Saved = require('../models/Saved');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's saved items
router.get('/', auth, async (req, res) => {
  try {
    let saved = await Saved.findOne({ user: req.user.userId });
    if (!saved) {
      saved = await Saved.create({ user: req.user.userId, items: new Map() });
    }
    res.json({ items: Array.from(saved.items.values()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to saved
router.post('/', auth, async (req, res) => {
  const { item } = req.body;
  try {
    let saved = await Saved.findOne({ user: req.user.userId });
    if (!saved) {
      saved = await Saved.create({ user: req.user.userId, items: new Map() });
    }

    // Use .has to check if already exists
    if (!saved.items.has(item.id)) {
      saved.items.set(item.id, item);
      saved.markModified('items');  // ensure Mongoose sees the change
      await saved.save();
    }

    res.json({ items: Array.from(saved.items.values()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from saved
router.delete('/', auth, async (req, res) => {
  const { id } = req.body; // id of item to remove
  try {
    let saved = await Saved.findOne({ user: req.user.userId });
    if (saved && saved.items.has(id)) {
      saved.items.delete(id);
      saved.markModified('items');
      await saved.save();
    }

    res.json({ items: saved ? Array.from(saved.items.values()) : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
