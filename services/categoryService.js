const { pool, redisClient } = require('../app');
const { promisify } = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const getCategories = async () => {
  const cacheKey = 'categories:all';
  let categories = await getAsync(cacheKey);

  if (categories) {
    return JSON.parse(categories);
  } else {
    const result = await pool.query('SELECT * FROM categories');
    categories = result.rows;
    await setAsync(cacheKey, JSON.stringify(categories), 'EX', 3600);
    return categories;
  }
};

module.exports = {
  getCategories,
};
