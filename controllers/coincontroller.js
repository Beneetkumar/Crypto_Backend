const axios = require('axios');
const CurrentData = require('../models/CurrentData.js');
const HistoryData = require('../models/HistoryData.js');
const { fetchTopCoins } = require('../services/coingeckoservice.js');

exports.getCoins = async (req, res) => {
  try {
    const currency = req.query.currency?.toLowerCase() || 'usd';

    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
      },
    });

    const formattedData = data.map((coin) => ({
      rank:coin.market_cap_rank,
      coinId: coin.id || "",
      name: coin.name || "",
      symbol: coin.symbol || "",
      price: coin.current_price ?? 0,
      marketCap: coin.market_cap ?? 0,
      change24h: coin.price_change_percentage_24h ?? 0,
      timestamp: coin.last_updated ? new Date(coin.last_updated) : new Date(),
      
    }));

    await CurrentData.deleteMany({});
    await CurrentData.insertMany(formattedData);

    res.json(formattedData);
  } catch (err) {
    console.error(" Backend error in /api/coins:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
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
