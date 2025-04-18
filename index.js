
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

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

// API endpoint pour le chat
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("Erreur: La clé API Gemini n'est pas définie");
    return res.status(500).send("Désolé, le chatbot n'est pas correctement configuré. Veuillez définir la variable d'environnement GEMINI_API_KEY.");
  }
  
  // Créer un fichier temporaire pour le message utilisateur
  const userMessageFile = path.join('/tmp', 'user_message.txt');
  try {
    fs.writeFileSync(userMessageFile, message);
    
    // Exécuter le script Gemini
    const command = `GEMINI_API_KEY=${process.env.GEMINI_API_KEY} USER_MESSAGE="${message.replace(/"/g, '\\"')}" node ${path.join(__dirname, 'pilot', 'gemini.js')}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur d'exécution: ${error}`);
        return res.status(500).send("Désolé, une erreur s'est produite lors du traitement de votre demande.");
      }
      
      if (stderr) {
        console.error(`Erreur standard: ${stderr}`);
      }
      
      res.send(stdout || "Je n'ai pas de réponse pour le moment.");
    });
  } catch (error) {
    console.error(`Erreur lors du traitement du message: ${error}`);
    return res.status(500).send("Désolé, une erreur s'est produite lors du traitement de votre message.");
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Accédez à http://localhost:${PORT} pour voir la page de login`);
});
