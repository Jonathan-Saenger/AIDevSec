import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Navigation guard
const requireAuth = (to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (!token || user.role !== 'admin') {
    next('/')
  } else {
    next()
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/admin/article/new',
      name: 'article-new',
      component: () => import('../views/ArticlesEditorView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/admin/article/:id',
      name: 'article-edit',
      component: () => import('../views/ArticlesEditorView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue')
    }
  ],
  // Comportement de défilement personnalisé
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
