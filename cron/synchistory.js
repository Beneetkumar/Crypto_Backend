const cron = require('node-cron');
const { fetchTopCoins } = require('../services/coingeckoservice');
const HistoryData = require('../models/HistoryData');

const runCronJob = () => {
  cron.schedule('0 * * * *', async () => {
   
    try {
      const data = await fetchTopCoins();
      await HistoryData.insertMany(data);
      console.log('Historical data synced.');
    } catch (error) {
      console.error('Error in cron job:', error.message);
    }
  });
};

module.exports = runCronJob;
