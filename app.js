const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const redisClient = require('./db/redisClient'); // Import Redis client from separate file

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

app.use(express.json());

// Import routes
const articleRoutes = require('./routes/articleRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const userRoutes = require('./routes/userRoutes');

app.use('/articles', articleRoutes);
// app.use('/categories', categoryRoutes);
// app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
