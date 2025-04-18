
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Variable pour stocker les questions précédemment posées
let askedQuestions = [];

// Fonction pour obtenir une nouvelle question depuis l'API
async function getQuizQuestion() {
  try {
    const response = await axios.get('https://api-rest-a.vercel.app/quiz');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du quiz:', error);
    throw new Error('Impossible de récupérer la question de quiz');
  }
}

// Route pour obtenir une nouvelle question
router.get('/question', async (req, res) => {
  try {
    const quizData = await getQuizQuestion();
    
    // Analyser la réponse JSON pour extraire les informations nécessaires
    const responseText = quizData.response;
    
    // Extraction de la question
    const questionMatch = responseText.match(/Question : (.*?)(?:\n|$)/);
    const question = questionMatch ? questionMatch[1].trim() : 'Comment dit-on "concombre" en italien?';
    
    // Extraction des réponses possibles
    const optionsText = responseText.split('❓ Réponses possibles :')[1].split('🔑 Réponse correcte :')[0].trim();
    const options = optionsText.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const match = line.match(/\d+\.\s+(.*)/);
        return match ? match[1].trim() : '';
      });
    
    // Extraction de la réponse correcte
    const correctAnswerMatch = responseText.match(/🔑 Réponse correcte : (.*)/);
    let correctAnswer = correctAnswerMatch ? correctAnswerMatch[1].trim() : '';
    
    // Fonction pour décoder les entités HTML
    function decodeHTMLEntities(text) {
      if (!text) return '';
      
      const entities = {
        'ouml': 'ö', 'auml': 'ä', 'uuml': 'ü',
        'Ouml': 'Ö', 'Auml': 'Ä', 'Uuml': 'Ü',
        'szlig': 'ß', 'nbsp': ' ', 'amp': '&',
        'lt': '<', 'gt': '>', 'quot': '"',
        '#039': "'", '#034': '"'
      };
      
      return text.replace(/&([^;]+);/g, (match, entity) => {
        return entities[entity] || match;
      });
    }
    
    // Décodage des entités HTML dans la réponse correcte
    correctAnswer = decodeHTMLEntities(correctAnswer);
    
    // Décodage des entités HTML pour la question et les options
    const decodedQuestion = decodeHTMLEntities(question);
    const decodedOptions = options.map(option => decodeHTMLEntities(option));
    
    // Créer l'objet de question formaté
    const formattedQuestion = {
      question: decodedQuestion,
      options: decodedOptions,
      correctAnswer
    };
    
    console.log('Question formatée:', formattedQuestion);
    res.json(formattedQuestion);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la question' });
  }
});

// Route pour vérifier la réponse
router.post('/verify', (req, res) => {
  const { userAnswer, correctAnswer } = req.body;
  
  const isCorrect = userAnswer === correctAnswer;
  
  res.json({
    isCorrect,
    correctAnswer
  });
});

module.exports = router;
