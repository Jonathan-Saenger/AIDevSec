# AI Dev Sec 🚀

Une plateforme moderne dédiée au partage de connaissances sur la sécurité du développement web à l'ère de l'Intelligence Artificielle.

## 🌟 Fonctionnalités

- 📱 Interface responsive et moderne
- 📝 Système de blog avec éditeur riche
- 🔍 Filtrage des articles par catégorie
- 🔐 Authentification sécurisée
- 👨‍💼 Dashboard administrateur
- 🎨 Design cyberpunk moderne

## 🛠️ Stack Technique

### Frontend

#### Core
- **[Vue.js](https://vuejs.org/)** (v3.5) - Framework progressif pour construire des interfaces utilisateur
- **[Vue Router](https://router.vuejs.org/)** (v4.5) - Routage officiel pour Vue.js
- **[Pinia](https://pinia.vuejs.org/)** (v2.3) - Store pour la gestion d'état
- **[Axios](https://axios-http.com/)** (v1.7) - Client HTTP pour les requêtes API

#### Éditeur de Contenu
- **[TipTap](https://tiptap.dev/)** (v2.11) - Éditeur de texte riche
  - Extension Image
  - Extension Link
  - Starter Kit

#### Build & Development
- **[Vite](https://vitejs.dev/)** (v6.0) - Outil de build ultrarapide
- **Vite Plugin Vue DevTools** - Outils de développement

### Backend

#### Server
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** (v4.21) - Framework web minimaliste
- **[CORS](https://www.npmjs.com/package/cors)** (v2.8) - Middleware pour la gestion CORS

#### Base de Données
- **[MongoDB](https://www.mongodb.com/)** - Base de données NoSQL
- **[Mongoose](https://mongoosejs.com/)** (v8.9) - ODM pour MongoDB

#### Sécurité
- **[JWT](https://jwt.io/)** (v9.0) - JSON Web Tokens pour l'authentification
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** (v2.4) - Hachage des mots de passe
- **[dotenv](https://www.npmjs.com/package/dotenv)** (v16.4) - Gestion des variables d'environnement

#### Development
- **[Nodemon](https://nodemon.io/)** (v3.1) - Rechargement automatique du serveur

## 🚀 Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd aidevsec
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

4. Démarrer le serveur de développement
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

## 📁 Structure du Projet

```
aidevsec/
├── src/                    # Frontend source
│   ├── components/         # Composants Vue réutilisables
│   ├── views/             # Pages Vue
│   ├── services/          # Services (API, etc.)
│   ├── router/            # Configuration des routes
│   └── assets/            # Assets statiques
├── server/                # Backend source
│   ├── controllers/       # Contrôleurs
│   ├── models/           # Modèles Mongoose
│   ├── routes/           # Routes API
│   └── middleware/       # Middleware personnalisé
└── public/               # Fichiers publics
```

## 🔐 Sécurité

- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Protection CORS
- Validation des données
- Routes protégées pour l'administration

## 🌐 API Endpoints

### Articles
- `GET /api/articles` - Liste des articles
- `GET /api/articles/:id` - Détails d'un article
- `POST /api/articles` - Créer un article (Auth requis)
- `PUT /api/articles/:id` - Modifier un article (Auth requis)
- `DELETE /api/articles/:id` - Supprimer un article (Auth requis)

### Auth
- `POST /api/auth/login` - Connexion admin
- `GET /api/auth/profile` - Profil utilisateur (Auth requis)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📝 License

[MIT License](LICENSE)
