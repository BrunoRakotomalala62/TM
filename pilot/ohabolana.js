const express = require('express');
const router = express.Router();

// Utilisation d'une fonction asynchrone pour gérer les requêtes
router.get('/recherche', async (req, res) => {
  try {
    const { terme, page = 1 } = req.query;
    console.log("Terme recherché:", terme, "Page:", page);

    // Importer dynamiquement node-fetch
    const { default: fetch } = await import('node-fetch');

    const apiUrl = `https://test-api-milay-vercel.vercel.app/api/ohab/recherche?ohabolana=${encodeURIComponent(terme)}&page=${page}`;
    console.log("URL de l'API appelée:", apiUrl);
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Réponse de l'API:", data);
    res.json(data);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

module.exports = router;