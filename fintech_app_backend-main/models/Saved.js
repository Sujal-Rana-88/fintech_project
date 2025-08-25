const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: {
    type: Map,
    of: new mongoose.Schema({
      symbol: String,
      name: String,
      type: String,
      notes: String,
      targetPrice: Number,
      addedAt: { type: Date, default: Date.now }
    }, { _id: false })
  }
});
 

module.exports = mongoose.model('Saved', savedSchema); 
