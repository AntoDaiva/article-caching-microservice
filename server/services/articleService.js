const { pool } = require('../db/db');
const redisClient = require('../db/redisClient');

const getArticleById = async (id) => {
  const cacheKey = `article:${id}`;
  redisClient.connect();
  let article = await redisClient.get(cacheKey);

  if (article) {
    console.log('cache hit!');
    redisClient.quit();
    return JSON.parse(article);   
  } else {
    console.log('cache miss!');
    const result = await pool.query('SELECT * FROM article WHERE id = $1', [id]);
    article = result.rows[0];
    await redisClient.set(cacheKey, JSON.stringify(article), 'EX', 3600);
    redisClient.quit();
    return article;
  }
};

const getLatestArticles = async () => {
  const cacheKey = 'articles:latest';
  redisClient.connect();
  let articles = await redisClient.get(cacheKey);

  if (articles) {
    console.log('cache hit!');
    redisClient.quit();
    return JSON.parse(articles);
  } else {
    console.log('cache miss!');
    const result = await pool.query('SELECT * FROM article ORDER BY publish_date DESC LIMIT 10');
    articles = result.rows;
    await redisClient.set(cacheKey, JSON.stringify(articles), 'EX', 3600);
    redisClient.quit();
    return articles;
  }
};

const addArticle = async (articleData) => {
  const query = `INSERT INTO article (content, publish_date, headline, category) VALUES ('${articleData.content}', '${articleData.publish_date}', '${articleData.headline}', '${articleData.category}') RETURNING *`;
  redisClient.connect();

  try {
    const result = await pool.query(query);
    const newArticle = result.rows[0];
    if (newArticle) {
      const cacheKey = `article:${newArticle.id}`;
      await redisClient.set(cacheKey, JSON.stringify(newArticle), 'EX', 3600);
    }
    redisClient.quit();
    return newArticle;
  } catch (error) {
    console.error('Error adding article:', error);
    redisClient.quit();
    throw error;
  }
};

module.exports = {
  getArticleById,
  getLatestArticles,
  addArticle
};
