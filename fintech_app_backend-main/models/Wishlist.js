const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: {
    type: Map,
    of: new mongoose.Schema({
      symbol: String,
      name: String,
      type: String,
      addedAt: { type: Date, default: Date.now }
    }, { _id: false })
  }
}, { collection: 'mywishlist' });

module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
