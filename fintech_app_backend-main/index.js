const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const wishlistRoutes = require('./routes/wishlist');
const savedRoutes = require('./routes/saved');
const marketRoutes = require('./routes/market');
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/market', marketRoutes);

// Placeholder route
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 