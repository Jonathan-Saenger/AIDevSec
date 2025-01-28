import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    togglePublishStatus
} from '../controllers/articleController.js';

const router = express.Router();

// Routes publiques
router.get('/articles', getArticles);
router.get('/articles/:id', getArticleById);

// Routes protégées (nécessitent une authentification)
router.post('/articles', auth, createArticle);
router.put('/articles/:id', auth, updateArticle);
router.delete('/articles/:id', auth, deleteArticle);
router.patch('/articles/:id/publish', auth, togglePublishStatus);

export default router;