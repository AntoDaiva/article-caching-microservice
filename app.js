const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// const redisClient = redis.createClient({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
// });

const redisClient = redis.createClient();

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

async function someAsyncFunction() {
  // Your code here
  await redisClient.connect();

  await redisClient.set('key', 'value');
  const value = await redisClient .get('key');

  await redisClient.hSet('user-session:123', {
    name: 'John',
    surname: 'Smith',
    company: 'Redis',
    age: 29
  })

  let userSession = await redisClient.hGetAll('user-session:123');
  console.log(JSON.stringify(userSession, null, 2));
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { pool, redisClient };
