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
    try {
      const currentPage = parseInt(page, 10);
      const nextPage = currentPage + 1;
      
      const nextPageResponse = await fetch(`https://test-api-milay-vercel.vercel.app/api/ohab/recherche?ohabolana=${encodeURIComponent(terme)}&page=${nextPage}`);
      const nextPageData = await nextPageResponse.json();
      
      if (nextPageData.resultats && nextPageData.resultats.length > 0) {
        // Si une page suivante existe, on l'indique dans la réponse
        data.pageSuivante = nextPage;
        data.estDernierePage = false;
      } else {
        // Si pas de page suivante, on indique que c'est la dernière page
        data.pageSuivante = null;
        data.estDernierePage = true;
      }
    } catch (err) {
      console.error("Erreur lors de la vérification de la page suivante:", err);
      // En cas d'erreur, on suppose que c'est la dernière page
      data.pageSuivante = null;
      data.estDernierePage = true;
    }
    
    console.log("Réponse de l'API (modifiée si nécessaire):", data);
    res.json(data);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

module.exports = router;