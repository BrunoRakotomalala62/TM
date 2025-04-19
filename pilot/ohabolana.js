
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/recherche', async (req, res) => {
  try {
    const { terme, page = 1 } = req.query;
    console.log("Terme recherché:", terme, "Page:", page);
    const response = await fetch(`https://test-api-milay-vercel.vercel.app/api/ohab/recherche?ohabolana=${encodeURIComponent(terme)}&page=${page}`);
    const data = await response.json();
    console.log("Réponse de l'API:", data);
    res.json(data);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

module.exports = router;
