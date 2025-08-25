const express = require('express');
const Wishlist = require('../models/Wishlist');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.userId });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user.userId, items: new Map() });

    // Convert items Map to array
    const itemsArray = Array.from(wishlist.items.entries()).map(([id, value]) => ({
      id,
      ...value.toObject() // convert subdocument to plain object
    }));

    res.json({ items: itemsArray });
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to wishlist
router.post('/', auth, async (req, res) => {
  const { item } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.userId });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user.userId, items: new Map() });

    if (!wishlist.items.has(item.id)) {
      wishlist.items.set(item.id, {
        symbol: item.symbol,
        name: item.name,
        type: item.type,
        addedAt: new Date()
      });
      await wishlist.save();
    }

    // Convert to array again
    const itemsArray = Array.from(wishlist.items.entries()).map(([id, value]) => ({
      id,
      ...value.toObject()
    }));

    res.json({ items: itemsArray });
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from wishlist
router.delete('/', auth, async (req, res) => {
  const { item } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.userId });
    if (wishlist && wishlist.items.has(item.id)) {
      wishlist.items.delete(item.id);
      await wishlist.save();
    }

    // Convert to array again
    const itemsArray = Array.from(wishlist.items.entries()).map(([id, value]) => ({
      id,
      ...value.toObject()
    }));

    res.json({ items: itemsArray });
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
