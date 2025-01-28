const Article = require('../models/Article');

// Obtenir tous les articles
exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username');
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
    }
};

// Obtenir un article par son ID
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'username');
        
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'article' });
    }
};

// Créer un nouvel article
exports.createArticle = async (req, res) => {
    try {
        const { title, content, summary, category, tags, published } = req.body;
        
        const article = new Article({
            title,
            content,
            summary,
            category,
            tags,
            published,
            author: req.user._id // Ajouté par le middleware d'authentification
        });
        
        const savedArticle = await article.save();
        res.status(201).json(savedArticle);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Erreur lors de la création de l\'article' });
    }
};

// Mettre à jour un article
exports.updateArticle = async (req, res) => {
    try {
        const { title, content, summary, category, tags, published } = req.body;
        
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Vérifier que l'utilisateur est l'auteur
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Non autorisé à modifier cet article' });
        }
        
        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                summary,
                category,
                tags,
                published
            },
            { new: true, runValidators: true }
        ).populate('author', 'username');
        
        res.json(updatedArticle);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article' });
    }
};

// Supprimer un article
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Vérifier que l'utilisateur est l'auteur
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Non autorisé à supprimer cet article' });
        }
        
        await article.remove();
        res.json({ message: 'Article supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
    }
};

// Publier/Dépublier un article
exports.togglePublishStatus = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Vérifier que l'utilisateur est l'auteur
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Non autorisé à modifier cet article' });
        }
        
        article.published = !article.published;
        await article.save();
        
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification du statut de publication' });
    }
};