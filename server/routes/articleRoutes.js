import express from 'express';
import Article from '../models/Article.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Routes publiques (lecture)
router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

// Routes protégées (création, modification, suppression)
router.post('/articles', auth, async (req, res) => {
  const article = new Article({
    ...req.body,
    author: req.user.username // Utilise le nom d'utilisateur connecté
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/articles/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    // Vérifie si l'utilisateur est l'auteur ou admin
    if (article.author !== req.user.username && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à modifier cet article' });
    }

    Object.assign(article, req.body);
    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/articles/:id', auth, isAdmin, async (req, res) => {
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

// Routes de filtrage (publiques)
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

// Route pour obtenir les articles d'un auteur spécifique
router.get('/articles/author/:username', async (req, res) => {
  try {
    const articles = await Article.find({ 
      author: req.params.username,
      published: true 
    }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;