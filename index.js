
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route principale qui redirige vers la page de connexion
app.get('/', (req, res) => {
  console.log('Redirection vers la page de login');
  res.sendFile(path.join(__dirname, 'utils', 'login.html'));
});

// Bloquer l'accès direct à index.html sans authentification
app.get('/index.html', (req, res) => {
  res.redirect('/');
});

// Servir les fichiers statiques seulement après les routes spécifiques
app.use(express.static('public'));
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

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Accédez à http://localhost:${PORT} pour voir la page de login`);
});
