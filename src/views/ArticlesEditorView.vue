
<template>
  <div class="article-editor">
    <header class="editor-header">
      <h1>{{ isNewArticle ? 'Nouvel Article' : 'Modifier l\'Article' }}</h1>
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
              <option value="security">Sécurité</option>
              <option value="ai">Intelligence Artificielle</option>
              <option value="development">Développement</option>
              <option value="cloud">Cloud</option>
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
          <button
            v-for="item in editorButtons"
            :key="item.command"
            @click="item.action"
            :class="{ active: item.isActive?.() }"
            class="toolbar-button"
            :title="item.label"
          >
            <i :class="item.icon"></i>
          </button>
        </div>

        <editor-content :editor="editor" class="editor-content" />
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { secureApi } from '../services/api'

const router = useRouter()
const route = useRoute()
const isNewArticle = route.name === 'article-new'

// État de l'article
const article = ref({
  title: '',
  content: '',
  summary: '',
  category: '',
  tags: [],
  published: false
})

const tagInput = ref('')
const error = ref('')
const saving = ref(false)

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

// Chargement de l'article existant
const loadArticle = async () => {
  if (!isNewArticle) {
    try {
      const response = await secureApi.getArticle(route.params.id)
      article.value = response.data
      editor.commands.setContent(article.value.content)
    } catch (err) {
      error.value = 'Erreur lors du chargement de l\'article'
      console.error(err)
    }
  }
}

// Sauvegarde
const saveArticle = async (publish = false) => {
  try {
    saving.value = true
    error.value = ''

    const articleData = {
      ...article.value,
      published: publish
    }

    if (isNewArticle) {
      await secureApi.createArticle(articleData)
    } else {
      await secureApi.updateArticle(route.params.id, articleData)
    }

    router.push('/admin')
  } catch (err) {
    error.value = 'Erreur lors de la sauvegarde'
    console.error(err)
  } finally {
    saving.value = false
  }
}

const saveAsDraft = () => saveArticle(false)
const publishArticle = () => saveArticle(true)

// Cycle de vie
onMounted(() => {
  loadArticle()
})

onBeforeUnmount(() => {
  editor.destroy()
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
  padding: 0.5rem;
  background: #2a2a2a;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.toolbar-button {
  padding: 0.5rem;
  border: none;
  background: none;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background: #333;
  color: #fff;
}

.toolbar-button.active {
  background: #4a9eff;
  color: white;
}

.editor-content {
  background: #2a2a2a;
  border-radius: 4px;
  padding: 1rem;
  min-height: 300px;
}

/* Styles pour le contenu de l'éditeur */
:deep(.ProseMirror) {
  min-height: 300px;
  color: #fff;
}

:deep(.ProseMirror p) {
  margin: 1em 0;
}

:deep(.ProseMirror h1) {
  font-size: 2em;
  margin: 1em 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 3px solid #4a9eff;
  padding-left: 1em;
  margin: 1em 0;
}

:deep(.ProseMirror pre) {
  background: #333;
  padding: 1em;
  border-radius: 4px;
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
}
</style>