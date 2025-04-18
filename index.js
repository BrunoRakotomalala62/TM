
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// Middleware pour analyser les données du formulaire
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques des dossiers utils et public
app.use(express.static('utils'));
app.use(express.static('public'));

// Route principale qui redirige vers la page de connexion
app.get('/', (req, res) => {
  res.redirect('/utils/login.html');
});

// Route pour vérifier les informations de connexion
app.post('/verify-login', (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Lire le contenu du fichier cle.txt
    const key = fs.readFileSync(path.join(__dirname, 'utils', 'cle.txt'), 'utf8').trim();
    
    // Vérifier si le mot de passe correspond à la clé
    if (password === key) {
      res.json({ success: true, redirectUrl: '/index.html' });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.json({ success: false });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
