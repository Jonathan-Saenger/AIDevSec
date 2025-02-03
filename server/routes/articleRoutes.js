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

// Middleware de logging pour les routes d'articles
router.use((req, res, next) => {
    console.log(`[Articles Route] ${req.method} ${req.path}`);
    next();
});

// Routes publiques
router.get('/articles', async (req, res, next) => {
    console.log('Fetching articles...');
    try {
        await getArticles(req, res);
        console.log('Articles fetched successfully');
    } catch (error) {
        console.error('Error fetching articles:', error);
        next(error);
    }
});

router.get('/articles/:id', async (req, res, next) => {
    console.log(`Fetching article with id: ${req.params.id}`);
    try {
        await getArticleById(req, res);
        console.log('Article fetched successfully');
    } catch (error) {
        console.error('Error fetching article:', error);
        next(error);
    }
});

// Routes protégées (nécessitent une authentification)
router.post('/articles', auth, async (req, res, next) => {
    console.log('Creating new article');
    try {
        await createArticle(req, res);
        console.log('Article created successfully');
    } catch (error) {
        console.error('Error creating article:', error);
        next(error);
    }
});

router.put('/articles/:id', auth, async (req, res, next) => {
    console.log(`Updating article with id: ${req.params.id}`);
    try {
        await updateArticle(req, res);
        console.log('Article updated successfully');
    } catch (error) {
        console.error('Error updating article:', error);
        next(error);
    }
});

router.delete('/articles/:id', auth, async (req, res, next) => {
    console.log(`Deleting article with id: ${req.params.id}`);
    try {
        await deleteArticle(req, res);
        console.log('Article deleted successfully');
    } catch (error) {
        console.error('Error deleting article:', error);
        next(error);
    }
});

router.patch('/articles/:id/publish', auth, async (req, res, next) => {
    console.log(`Toggling publish status for article with id: ${req.params.id}`);
    try {
        await togglePublishStatus(req, res);
        console.log('Article publish status toggled successfully');
    } catch (error) {
        console.error('Error toggling article publish status:', error);
        next(error);
    }
});

export default router;