const express = require('express');
const router = express.Router();
const articleService = require('../services/articleService');

router.get('/:id', async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const articles = await articleService.getLatestArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const articleData = req.body;
    const newArticle = await articleService.addArticle(articleData);
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
