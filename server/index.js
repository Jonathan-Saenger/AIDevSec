import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB Atlas'))
  .catch((error) => console.error('Erreur de connexion MongoDB:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', articleRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionnelle !' });
});

// Serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});