import express from 'express';
import Article from '../models/Article.js';

const router = express.Router();

// GET All
router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET by ID
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST
router.post('/articles', async (req, res) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
    summary: req.body.summary,
    category: req.body.category,
    tags: req.body.tags,
    imageUrl: req.body.imageUrl,
    published: req.body.published || false
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update by ID
router.put('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    Object.assign(article, req.body);
    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE
router.delete('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    await article.deleteOne();
    res.json({ message: 'Article supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET by catégorie
router.get('/articles/category/:category', async (req, res) => {
  try {
    const articles = await Article.find({ 
      category: req.params.category,
      published: true 
    }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET by tag
router.get('/articles/tag/:tag', async (req, res) => {
  try {
    const articles = await Article.find({ 
      tags: req.params.tag,
      published: true 
    }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;