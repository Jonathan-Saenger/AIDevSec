import express from 'express';
import articleController from '../controllers/articleController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Routes publiques
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticleById);

// Routes protégées (nécessitent une authentification)
router.post('/', protect, articleController.createArticle);
router.put('/:id', protect, articleController.updateArticle);
router.delete('/:id', protect, articleController.deleteArticle);
router.patch('/:id/publish', protect, articleController.togglePublishStatus);

export default router;