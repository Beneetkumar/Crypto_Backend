const axios = require('axios');

exports.fetchTopCoins = async () => {
  const url = 'https://api.coingecko.com/api/v3/coins/markets';
  const { data } = await axios.get(url, {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10,
      page: 1,
    },
  });

  return data.map(coin => ({
    rank:coin.market_cap_rank,
    coinId: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.current_price,
    marketCap: coin.market_cap,
    change24h: coin.price_change_percentage_24h,
    timestamp: new Date(coin.last_updated),
  }));
};
