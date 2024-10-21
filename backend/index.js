const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');


const bidRoutes = require('./routes/bidRoutes');
const userRoutes = require('./routes/userRoutes');


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors());


app.use('/api/bids', bidRoutes);
app.use('/api/users', userRoutes);


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
