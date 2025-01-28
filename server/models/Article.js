import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Le contenu est requis']
    },
    summary: {
        type: String,
        required: [true, 'Le résumé est requis'],
        trim: true
    },
    category: {
        type: String,
        enum: ['SÉCURITÉ', 
        'DÉVELOPPEMENT', 
        'ÉTHIQUE', 
        'IA', 
        'CLOUD', 
        'DONNÉES', 
        'API', 
        'RÉGULATIONS', 
        'INNOVATION'],
        required: [true, 'La catégorie est requise']
    },
    tags: [{
        type: String,
        trim: true
    }],
    published: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

//Méthode de résumé automatique
articleSchema.pre('save', function(next) {
  if (!this.summary && this.content) {
    // Prendre les 200 premiers caractères comme résumé
    this.summary = this.content.substring(0, 200) + '...';
  }
  next();
});

export default mongoose.model('Article', articleSchema);