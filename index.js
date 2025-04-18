
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Vérification des identifiants
app.post('/verify-login', (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Lire les informations d'identification depuis le fichier
    const credentials = fs.readFileSync(path.join(__dirname, 'utils/cle.txt'), 'utf8');
    const lines = credentials.split('\n');
    
    let isAuthenticated = false;
    
    // Vérifier chaque ligne pour trouver une correspondance
    for (const line of lines) {
      const [storedEmail, storedPassword] = line.trim().split(':');
      
      if (email === storedEmail && password === storedPassword) {
        isAuthenticated = true;
        break;
      }
    }
    
    if (isAuthenticated) {
      return res.json({ success: true });
    } else {
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
});
