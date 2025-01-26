import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
    maxLength: 200
  },
  author: {
    type: String,
    required: true,
    default: 'Jonathan Saenger'
  },
  category: {
    type: String,
    required: true,
    enum: ['IA & SÉCURITÉ', 'DÉVELOPPEMENT', 'CYBERSÉCURITÉ', 'INTELLIGENCE ARTIFICIELLE']
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: null
  },
  published: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
//Méthode de résumé automatique
articleSchema.pre('save', function(next) {
  if (!this.summary && this.content) {
    this.summary = this.content
      .substring(0, 197)
      .trim() + '...';
  }
  next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;