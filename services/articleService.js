const { pool, redisClient } = require('../app');
const { promisify } = require('util');
// const getAsync = promisify(redisClient.get).bind(redisClient);
// const setAsync = promisify(redisClient.set).bind(redisClient);

const getArticleById = async (id) => {
  const cacheKey = `article:${id}`;
  let article = await redisClient.get(cacheKey);

  if (article) {
    console.log('cache hit!');
    return JSON.parse(article);   
  } else {
    console.log('cache miss!');
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    article = result.rows[0];
    await redisClient.set(cacheKey, JSON.stringify(article), 'EX', 3600);
    return article;
  }
};

const getLatestArticles = async () => {
  const cacheKey = 'articles:latest';
  let articles = await redisClient.get(cacheKey);

  if (articles) {
    console.log('cache hit!');
    return JSON.parse(articles);
  } else {
    console.log('cache miss!');
    const result = await pool.query('SELECT * FROM article ORDER BY publish_date DESC LIMIT 10');
    articles = result.rows;
    await redisClient.set(cacheKey, JSON.stringify(articles), 'EX', 3600);
    return articles;
  }
};

module.exports = {
  getArticleById,
  getLatestArticles,
};
