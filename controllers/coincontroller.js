const axios = require('axios');
const CurrentData = require('../models/CurrentData.js');
const HistoryData = require('../models/HistoryData.js');
const { fetchTopCoins } = require('../services/coingeckoservice.js');

const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

exports.getCoins = async (req, res) => {
  const currency = req.query.currency?.toLowerCase() || 'usd';
  const cacheKey = `coinData_${currency}`; // unique cache key per currency

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
      },
    });

    cache.set(cacheKey, data); // cache result for this currency
    res.json(data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json({ error: 'API Error', details: err.message });
  }
};

exports.saveHistorySnapshot = async (req, res) => {
  try {
    const data = await fetchTopCoins();
    await HistoryData.insertMany(data);
    res.json({ message: 'Snapshot saved successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCoinHistory = async (req, res) => {
  try {
    const { coinId } = req.params;
    const history = await HistoryData.find({ coinId });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
