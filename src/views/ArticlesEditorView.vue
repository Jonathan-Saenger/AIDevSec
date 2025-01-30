
<template>
  <div class="article-editor">
    <header class="editor-header">
      <div class="header-left">
        <router-link to="/blog" class="btn-back">
          <i class="fas fa-arrow-left"></i>
          Retour au blog
        </router-link>
        <h1>{{ isNewArticle ? 'Nouvel Article' : 'Modifier l\'Article' }}</h1>
      </div>
      <div class="editor-actions">
        <button @click="saveAsDraft" class="btn-draft" :disabled="saving">
          <i class="fas fa-save"></i> 
          {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
        <button @click="publishArticle" class="btn-publish" :disabled="saving">
          <i class="fas fa-upload"></i>
          {{ article.published ? 'Mettre à jour' : 'Publier' }}
        </button>
      </div>
    </header>

    <div class="editor-main">
      <!-- Métadonnées -->
      <div class="metadata-section">
        <!-- Image de couverture -->
        <div class="form-group">
          <label>Image de couverture</label>
          <div class="cover-image-upload">
            <div 
              class="image-preview" 
              :class="{ 'has-image': article.image }"
              :style="article.image ? { backgroundImage: `url(${article.image})` } : {}"
            >
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                data-type="cover"
                class="file-input"
              >
              <div class="upload-overlay">
                <i class="fas fa-camera"></i>
                <span>{{ article.image ? 'Changer l\'image' : 'Ajouter une image de couverture' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Autres champs de métadonnées -->
        <div class="form-group">
          <label>Titre</label>
          <input 
            type="text" 
            v-model="article.title"
            placeholder="Titre de l'article"
            class="form-control"
          >
        </div>

        <div class="form-group">
          <label>Résumé</label>
          <textarea 
            v-model="article.summary"
            placeholder="Bref résumé de l'article"
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Catégorie</label>
            <select v-model="article.category" class="form-control">
              <option value="">Sélectionner une catégorie</option>
              <option value="SÉCURITÉ">Sécurité</option>
              <option value="DÉVELOPPEMENT">Développement</option>
              <option value="ÉTHIQUE">Éthique</option>
              <option value="IA">Intelligence Artificielle</option>
              <option value="CLOUD">Cloud</option>
              <option value="DONNÉES">Données</option>
              <option value="API">API</option>
              <option value="RÉGULATIONS">Régulations</option>
              <option value="INNOVATION">Innovation</option>
            </select>
          </div>

          <div class="form-group">
            <label>Tags</label>
            <div class="tags-input">
              <input 
                type="text"
                v-model="tagInput"
                @keydown.enter.prevent="addTag"
                placeholder="Ajouter un tag"
                class="form-control"
              >
              <div class="tags-list">
                <span 
                  v-for="tag in article.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                  <button @click="removeTag(tag)" class="remove-tag">&times;</button>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Éditeur de contenu -->
      <div class="content-editor">
        <div class="editor-toolbar">
          <div class="toolbar-group text-style">
            <button
              v-for="button in editorButtons"
              :key="button.command"
              class="toolbar-button"
              :class="{ 'is-active': button.isActive() }"
              @click="button.action()"
              :title="button.label"
              v-show="!(button.command === 'image')"
            >
              <i :class="button.icon" aria-hidden="true"></i>
              <span class="button-label">{{ button.label }}</span>
            </button>
          </div>
        </div>

        <editor-content :editor="editor" class="editor-content" />
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import axios from 'axios'
import { secureApi } from '../services/api'

const router = useRouter()
const route = useRoute()
const isNewArticle = route.name === 'article-new'
const saving = ref(false)
const errorMessage = ref('')

// État de l'article
const article = ref({
  title: '',
  content: '',
  summary: '',
  category: '',
  tags: [],
  published: false,
  image: null
})

const tagInput = ref('')

// Configuration de l'éditeur
const editor = new Editor({
  extensions: [
    StarterKit,
    Image,
    Link
  ],
  content: '',
  onUpdate: ({ editor }) => {
    article.value.content = editor.getHTML()
  }
})

// Fonction pour gérer l'upload d'image
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data && response.data.url) {
      if (event.target.dataset.type === 'cover') {
        article.value = {
          ...article.value,
          image: response.data.url
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error)
    errorMessage.value = 'Erreur lors de l\'upload de l\'image'
  }
}

// Chargement de l'article existant
const loadArticle = async () => {
  if (!isNewArticle) {
    try {
      const response = await secureApi.getArticle(route.params.id)
      if (response) {
        article.value = {
          ...response,
          tags: response.tags || []
        }
        editor.commands.setContent(response.content || '')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error)
      errorMessage.value = 'Erreur lors du chargement de l\'article'
      router.push('/articles')
    }
  }
}

// Sauvegarde de l'article
const saveArticle = async (publish = false) => {
  try {
    saving.value = true
    errorMessage.value = ''
    
    const articleData = {
      ...article.value,
      published: publish
    }

    let response
    if (isNewArticle) {
      response = await secureApi.createArticle(articleData)
    } else {
      response = await secureApi.updateArticle(article.value._id, articleData)
    }
    
    if (response) {
      if (isNewArticle) {
        router.push(`/articles/${response._id}`)
      } else {
        article.value = {
          ...response,
          tags: response.tags || []
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    errorMessage.value = 'Erreur lors de la sauvegarde de l\'article'
  } finally {
    saving.value = false
  }
}

const saveAsDraft = () => saveArticle(false)
const publishArticle = () => saveArticle(true)

// Boutons de la barre d'outils
const editorButtons = [
  {
    label: 'Gras',
    command: 'bold',
    icon: 'fas fa-bold',
    action: () => editor.chain().focus().toggleBold().run(),
    isActive: () => editor.isActive('bold')
  },
  {
    label: 'Italique',
    command: 'italic',
    icon: 'fas fa-italic',
    action: () => editor.chain().focus().toggleItalic().run(),
    isActive: () => editor.isActive('italic')
  },
  {
    label: 'Titre 1',
    command: 'heading',
    icon: 'fas fa-heading',
    action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => editor.isActive('heading', { level: 1 })
  },
  {
    label: 'Liste à puces',
    command: 'bulletList',
    icon: 'fas fa-list-ul',
    action: () => editor.chain().focus().toggleBulletList().run(),
    isActive: () => editor.isActive('bulletList')
  },
  {
    label: 'Liste numérotée',
    command: 'orderedList',
    icon: 'fas fa-list-ol',
    action: () => editor.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.isActive('orderedList')
  },
  {
    label: 'Citation',
    command: 'blockquote',
    icon: 'fas fa-quote-right',
    action: () => editor.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.isActive('blockquote')
  },
  {
    label: 'Code',
    command: 'code',
    icon: 'fas fa-code',
    action: () => editor.chain().focus().toggleCode().run(),
    isActive: () => editor.isActive('code')
  }
]

// Gestion des tags
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !article.value.tags.includes(tag)) {
    article.value.tags.push(tag)
  }
  tagInput.value = ''
}

const removeTag = (tagToRemove) => {
  article.value.tags = article.value.tags.filter(tag => tag !== tagToRemove)
}

// Cycle de vie
onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-editor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.editor-actions {
  display: flex;
  gap: 1rem;
}

.editor-main {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 2rem;
}

.metadata-section {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a9eff;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #333;
  border-radius: 4px;
  background: #2a2a2a;
  color: #fff;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #4a9eff;
}

.tags-input {
  position: relative;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: #4a9eff;
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  margin-left: 0.5rem;
  cursor: pointer;
  padding: 0 0.25rem;
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #2d3748;
  border-radius: 6px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #4a5568;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  gap: 0.5rem;
  padding-right: 1rem;
  border-right: 1px solid #4a5568;
}

.toolbar-group:last-child {
  border-right: none;
}

.toolbar-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  background: #3a4556;
  border: none;
  border-radius: 4px;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-width: 40px;
}

.toolbar-button i {
  font-size: 1.1rem;
}

.toolbar-button .button-label {
  font-size: 0.9rem;
  display: inline-block;
}

.toolbar-button:hover {
  background: #4a5568;
  transform: translateY(-1px);
}

.toolbar-button.is-active {
  background: #4299e1;
  color: white;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.editor-content {
  background: #2a2a2a;
  border-radius: 4px;
  padding: 1rem;
  min-height: 300px;
}

.editor-content img {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cover-image-upload {
  margin-bottom: 1rem;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.image-preview.has-image .upload-overlay {
  opacity: 0;
}

.image-preview:hover .upload-overlay {
  opacity: 1;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: opacity 0.3s;
}

.upload-overlay i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

/* Styles pour le contenu de l'éditeur */
:deep(.ProseMirror) {
  min-height: 300px;
  color: #fff;
  padding: 1rem;
}

:deep(.ProseMirror p) {
  margin: 1em 0;
  line-height: 1.6;
}

:deep(.ProseMirror h1) {
  font-size: 2em;
  margin: 1em 0;
  color: #4a9eff;
}

:deep(.ProseMirror h2) {
  font-size: 1.5em;
  margin: 0.83em 0;
  color: #4a9eff;
}

:deep(.ProseMirror h3) {
  font-size: 1.17em;
  margin: 1em 0;
  color: #4a9eff;
}

:deep(.ProseMirror blockquote) {
  border-left: 3px solid #4a9eff;
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
  color: #a0aec0;
}

:deep(.ProseMirror pre) {
  background: #333;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

:deep(.ProseMirror code) {
  background: #333;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.btn-draft, .btn-publish {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-draft {
  background: #2a2a2a;
  color: #fff;
}

.btn-publish {
  background: #4a9eff;
  color: white;
}

.btn-draft:hover, .btn-publish:hover {
  transform: translateY(-1px);
}

.btn-draft:disabled, .btn-publish:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #ff4a4a;
  margin-top: 1rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 74, 74, 0.1);
  border-radius: 4px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a9eff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
  background: rgba(74, 158, 255, 0.1);
}

.btn-back:hover {
  background: rgba(74, 158, 255, 0.2);
  transform: translateX(-5px);
}

.btn-back i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .editor-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .editor-actions {
    justify-content: center;
  }
  
  .toolbar-button .button-label {
    display: none;
  }
  
  .header-left {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .btn-back {
    width: 100%;
    justify-content: center;
  }
}
</style>