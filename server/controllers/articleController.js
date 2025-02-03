import Article from '../models/Article.js';

// Obtenir tous les articles
export const getArticles = async (req, res) => {
    console.log('Controller: Getting all articles');
    try {
        console.log('Attempting to fetch articles from database...');
        const articles = await Article.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username');
        console.log(`Found ${articles.length} articles`);
        res.json(articles);
    } catch (error) {
        console.error('Error in getArticles:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des articles',
            error: error.message 
        });
    }
};

// Obtenir un article par son ID
export const getArticleById = async (req, res) => {
    console.log(`Controller: Getting article by ID: ${req.params.id}`);
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'username');
        
        if (!article) {
            console.log('Article not found');
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        console.log('Article found:', article._id);
        res.json(article);
    } catch (error) {
        console.error('Error in getArticleById:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération de l\'article',
            error: error.message 
        });
    }
};

// Créer un nouvel article
export const createArticle = async (req, res) => {
    console.log('Controller: Creating new article');
    try {
        console.log('Attempting to create new article...');
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
        console.log('Article created:', savedArticle._id);
        res.status(201).json(savedArticle);
    } catch (error) {
        console.error('Error in createArticle:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ 
            message: 'Erreur lors de la création de l\'article',
            error: error.message 
        });
    }
};

// Mettre à jour un article
export const updateArticle = async (req, res) => {
    console.log(`Controller: Updating article by ID: ${req.params.id}`);
    try {
        console.log('Attempting to update article...');
        const { title, content, summary, category, tags, published, image } = req.body;
        
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            console.log('Article not found');
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Vérifier que l'utilisateur est l'auteur
        if (article.author.toString() !== req.user._id.toString()) {
            console.log('Unauthorized to update article');
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
        console.log('Article updated:', updatedArticle._id);
        res.json(updatedArticle);
    } catch (error) {
        console.error('Error in updateArticle:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour de l\'article',
            error: error.message 
        });
    }
};

// Supprimer un article
export const deleteArticle = async (req, res) => {
    console.log(`Controller: Deleting article by ID: ${req.params.id}`);
    try {
        console.log('Attempting to delete article...');
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            console.log('Article not found');
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Vérifier que l'utilisateur est l'auteur
        if (article.author.toString() !== req.user._id.toString()) {
            console.log('Unauthorized to delete article');
            return res.status(403).json({ message: 'Non autorisé à supprimer cet article' });
        }
        
        await Article.findByIdAndDelete(req.params.id);
        console.log('Article deleted:', req.params.id);
        res.json({ message: 'Article supprimé avec succès' });
    } catch (error) {
        console.error('Error in deleteArticle:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la suppression de l\'article',
            error: error.message 
        });
    }
};

// Publier/Dépublier un article
export const togglePublishStatus = async (req, res) => {
    console.log(`Controller: Toggling publish status of article by ID: ${req.params.id}`);
    try {
        console.log('Attempting to toggle publish status...');
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            console.log('Article not found');
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Vérifier que l'utilisateur est l'auteur
        if (article.author.toString() !== req.user._id.toString()) {
            console.log('Unauthorized to toggle publish status');
            return res.status(403).json({ message: 'Non autorisé à modifier cet article' });
        }
        
        article.published = !article.published;
        await article.save();
        console.log('Publish status toggled:', article.published);
        res.json(article);
    } catch (error) {
        console.error('Error in togglePublishStatus:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la modification du statut de publication',
            error: error.message 
        });
    }
};