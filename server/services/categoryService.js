const { pool } = require('../db/db');
const redisClient = require('../db/redisClient');

const getCategories = async () => {
  const cacheKey = 'categories:all';
  let categories = await redisClient.get(cacheKey);

  if (categories) {
    return JSON.parse(categories);
  } else {
    const result = await pool.query('SELECT * FROM categories');
    categories = result.rows;
    await redisClient.set(cacheKey, JSON.stringify(categories), 'EX', 3600);
    return categories;
  }
};

module.exports = {
  getCategories,
};
