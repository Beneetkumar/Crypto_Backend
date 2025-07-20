const express = require('express');
const router = express.Router();
const {
  getCoins,
  saveHistorySnapshot,
  getCoinHistory
} = require('../controllers/coincontroller');

router.get('/coins', getCoins);
router.post('/history', saveHistorySnapshot);
router.get('/history/:coinId', getCoinHistory); 
module.exports = router;
