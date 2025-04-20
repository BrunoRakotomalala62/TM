
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route principale qui redirige vers la page de connexion
app.get('/', (req, res) => {
  console.log('Redirection vers la page de login');
  res.sendFile(path.join(__dirname, 'utils', 'login.html'));
});

// Route pour index.html qui va vérifier l'authentification (à implémenter plus tard)
app.get('/index.html', (req, res) => {
  // Pour l'instant, on permet l'accès direct à index.html après connexion
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servir les fichiers statiques CSS et JS
app.use(express.static('public', {
  index: false // Empêche de servir index.html directement sans passer par la route
}));
app.use(express.static('utils'));

// Vérification des identifiants
app.post('/verify-login', (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Lire les informations d'identification depuis le fichier
    const credentials = fs.readFileSync(path.join(__dirname, 'utils/cle.txt'), 'utf8');
    const lines = credentials.trim().split('\n');
    
    console.log('Tentative de connexion:', email, password);
    console.log('Contenu de cle.txt:', lines);
    
    // Vérifier si les identifiants correspondent
    const validEmail = lines[0].trim();
    const validPassword = lines[2].trim();
    
    if (email === validEmail && password === validPassword) {
      console.log('Connexion réussie');
      return res.json({ success: true });
    } else {
      console.log('Échec de connexion: identifiants invalides');
      return res.json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des identifiants:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Route pour la page chatbot
app.get('/chat/chatbot', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat', 'chatbot.html'));
});

// Route pour la page À propos/contact
app.get('/index/A-propos/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'A-propos', 'contact.html'));
});

// Route pour les images de profil
app.get('/index/A-propos/contact/photos/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'A-propos', 'contact', 'photos', req.params.filename));
});

// Import et utilisation du router Gemini
const geminiRouter = require('./pilot/gemini').router;
app.use('/api', geminiRouter);

// Import et utilisation du router Quiz
const quizRouter = require('./pilot/quiz');
app.use('/api/quiz', quizRouter);

// Import et utilisation du router Ohabolana
const ohabolanaRouter = require('./pilot/ohabolana');
app.use('/api/ohabolana', ohabolanaRouter);

// Import et utilisation du router Horoscope
const horoscopeRouter = require('./pilot/horoscope');
app.use('/api/horoscope', horoscopeRouter);

// Route pour la page quiz
app.get('/index/quiz/quiz.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'quiz', 'quiz.html'));
});

// Route pour la page cours
app.get('/index/cours/cours.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'cours.html'));
});

// Route pour la page 4ème
app.get('/index/cours/4eme/4eme.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', '4eme', '4eme.html'));
});

// Route pour la page 6ème
app.get('/index/cours/6eme/6eme.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', '6eme', '6eme.html'));
});

// Route pour la page 2nde
app.get('/index/cours/2nde/2nde.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', '2nde', '2nde.html'));
});

// Route pour la page 1ere
app.get('/index/cours/1ere/1ere.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', '1ere', '1ere.html'));
});

// Routes pour la section Divers
app.get('/index/divers/divers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'divers', 'divers.html'));
});

app.get('/index/divers/horoscope/horoscope.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'divers', 'horoscope', 'horoscope.html'));
});

app.get('/index/divers/horoscope/dynamique.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'divers', 'horoscope', 'dynamique.html'));
});

app.get('/index/divers/ohabolana/ohabolana.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'divers', 'ohabolana', 'ohabolana.html'));
});

app.get('/index/divers/kabary/kabary.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'divers', 'kabary', 'kabary.html'));
});

// Route pour la page terminale
app.get('/index/cours/terminale/terminale.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'terminale.html'));
});

// Routes pour les pages malagasy des séries terminales
app.get('/index/cours/terminale/A/matiereA/malagasy.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'A', 'matiereA', 'malagasy.html'));
});

app.get('/index/cours/terminale/C/matiereC/malagasy.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'C', 'matiereC', 'malagasy.html'));
});

app.get('/index/cours/terminale/D/matiereD/malagasy.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'D', 'matiereD', 'malagasy.html'));
});

// API pour obtenir la liste des PDFs (pour le chargement dynamique)
app.get('/api/get-pdf-list', (req, res) => {
  const basePath = path.join(__dirname, 'Attachement', 'index', 'cours');
  const requestedPath = req.query.path;
  
  // Validation du chemin pour éviter les attaques de traversée de chemin
  if (!requestedPath || requestedPath.includes('..')) {
    return res.status(400).json({ error: 'Chemin invalide' });
  }
  
  const fullPath = path.join(basePath, requestedPath);
  
  try {
    // Vérifier si le répertoire existe
    if (!fs.existsSync(fullPath)) {
      return res.json({ files: [] });
    }
    
    // Lire les fichiers du répertoire
    const files = fs.readdirSync(fullPath)
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => {
        // Formatter le nom du fichier pour l'affichage
        const displayName = file
          .replace(/\.pdf$/i, '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());
        
        return {
          name: displayName,
          path: `/Attachement/index/cours/${requestedPath}/${file}`
        };
      });
    
    res.json({ files });
  } catch (error) {
    console.error('Erreur lors de la lecture des PDFs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les pages de matières de la Série A
app.get('/index/cours/terminale/A/matiereA.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'A', 'matiereA.html'));
});

// Routes pour les pages de matières de la Série D
app.get('/index/cours/terminale/D/matiereD.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'D', 'matiereD.html'));
});

// Routes pour les pages de matières de la Série C
app.get('/index/cours/terminale/C/matiereC.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'C', 'matiereC.html'));
});

// Routes pour les pages de matières de la Série L
app.get('/index/cours/terminale/L/matiereL.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'L', 'matiereL.html'));
});

// Routes pour les pages de matières de la Série OSE
app.get('/index/cours/terminale/OSE/matiereOSE.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'OSE', 'matiereOSE.html'));
});

// Routes pour les pages de matières de la Série S
app.get('/index/cours/terminale/S/matiereS.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', 'terminale', 'S', 'matiereS.html'));
});

// Route pour la page malagasy 5ème
app.get('/index/cours/5eme/malagasy/malagasy5e.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', '5eme', 'malagasy', 'malagasy5e.html'));
});

// Route pour la page malagasy 4ème
app.get('/index/cours/4eme/malagasy/malagasy4e.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', '4eme', 'malagasy', 'malagasy4e.html'));
});

// Route pour la page malagasy 6ème
app.get('/index/cours/6eme/malagasy/malagasy6e.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', '6eme', 'malagasy', 'malagasy6e.html'));
});

// Route pour la page malagasy 2nde
app.get('/index/cours/2nde/malagasy/malagasy2nde.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index', 'cours', '2nde', 'malagasy', 'malagasy2nde.html'));
});

// Route pour servir les fichiers PDF des cours
app.get('/Attachement/index/cours/:niveau/malagasy/:filename', (req, res) => {
  const niveau = req.params.niveau;
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, 'Attachement', 'index', 'cours', niveau, 'malagasy', filename));
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Accédez à http://0.0.0.0:${PORT} pour voir la page de login`);
});
