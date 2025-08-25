const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// Fetch top coins from CoinGecko
router.get('/coins', auth, async (req, res) => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false,
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching coins' });
  }
});

// Fetch stock data from Yahoo Finance (using public API via RapidAPI)
router.get('/stocks', auth, async (req, res) => {
  try {
    // Example: fetch Apple, Google, Amazon
    const symbols = 'AAPL,GOOGL,AMZN,MSFT,TSLA';
    const { data } = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`);
    res.json(data.quoteResponse.result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stocks' });
  }
});

module.exports = router; 