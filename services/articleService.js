const { pool, redisClient } = require('../app');
const { promisify } = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const getArticleById = async (id) => {
  const cacheKey = `article:${id}`;
  let article = await getAsync(cacheKey);

  if (article) {
    return JSON.parse(article);
  } else {
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    article = result.rows[0];
    await setAsync(cacheKey, JSON.stringify(article), 'EX', 3600);
    return article;
  }
};

const getLatestArticles = async () => {
  const cacheKey = 'articles:latest';
  let articles = await getAsync(cacheKey);

  if (articles) {
    return JSON.parse(articles);
  } else {
    const result = await pool.query('SELECT * FROM articles ORDER BY published_date DESC LIMIT 10');
    articles = result.rows;
    await setAsync(cacheKey, JSON.stringify(articles), 'EX', 600);
    return articles;
  }
};

module.exports = {
  getArticleById,
  getLatestArticles,
};
