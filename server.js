const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const coinRoutes = require('./routes/coins');
const runCronJob = require('./cron/synchistory.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', coinRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  runCronJob();
}).catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mongoose.connect(process.env.MONGO_URI).then(()=>{
//     console.log(`MongoDb connected`)
// }).catch(err => console.error('MongoDB connection error:', err));
