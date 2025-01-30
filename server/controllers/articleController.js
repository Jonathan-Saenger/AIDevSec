import Article from '../models/Article.js';

// Obtenir tous les articles
export const getArticles = async (req, res) => {
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
export const getArticleById = async (req, res) => {
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
export const createArticle = async (req, res) => {
    try {
        const { title, content, summary, category, tags, published, image } = req.body;
        
        const article = new Article({
            title,
            content,
            summary,
            category,
            tags,
            published,
            image,
            author: req.user._id
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
export const updateArticle = async (req, res) => {
    try {
        const { title, content, summary, category, tags, published, image } = req.body;
        
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Vérifier que l'utilisateur est l'auteur
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Non autorisé à modifier cet article' });
        }
        
        article.title = title || article.title;
        article.content = content || article.content;
        article.summary = summary || article.summary;
        article.category = category || article.category;
        article.tags = tags || article.tags;
        article.published = published !== undefined ? published : article.published;
        article.image = image !== undefined ? image : article.image;
        
        const updatedArticle = await article.save();
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
export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Vérifier que l'utilisateur est l'auteur
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Non autorisé à supprimer cet article' });
        }
        
        await Article.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
    }
};

// Publier/Dépublier un article
export const togglePublishStatus = async (req, res) => {
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