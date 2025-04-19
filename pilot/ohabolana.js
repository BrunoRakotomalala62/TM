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
    
    // Vérifier si une page suivante existe
    if (page === '1' || page === 1) {
      try {
        const nextPageResponse = await fetch(`https://test-api-milay-vercel.vercel.app/api/ohab/recherche?ohabolana=${encodeURIComponent(terme)}&page=2`);
        const nextPageData = await nextPageResponse.json();
        
        if (nextPageData.resultats && nextPageData.resultats.length > 0) {
          // Si une page 2 existe, on modifie la valeur de pageSuivante
          data.pageSuivante = 2;
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la page suivante:", err);
      }
    }
    
    console.log("Réponse de l'API (modifiée si nécessaire):", data);
    res.json(data);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

module.exports = router;