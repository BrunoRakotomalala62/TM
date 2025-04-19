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
    
    // Calculer le nombre total de pages en vérifiant toutes les pages suivantes
    try {
      const currentPage = parseInt(page, 10);
      let totalPages = currentPage;
      let hasMorePages = true;
      let checkPage = currentPage + 1;
      
      // On vérifie jusqu'à 10 pages maximum pour ne pas surcharger l'API
      const MAX_PAGES_TO_CHECK = 10;
      let pagesChecked = 0;
      
      while (hasMorePages && pagesChecked < MAX_PAGES_TO_CHECK) {
        const nextPageResponse = await fetch(`https://test-api-milay-vercel.vercel.app/api/ohab/recherche?ohabolana=${encodeURIComponent(terme)}&page=${checkPage}`);
        const nextPageData = await nextPageResponse.json();
        
        if (nextPageData.resultats && nextPageData.resultats.length > 0) {
          totalPages = checkPage;
          checkPage++;
          pagesChecked++;
        } else {
          hasMorePages = false;
        }
      }
      
      // Ajouter les informations de pagination à la réponse
      data.pageCourante = currentPage;
      data.totalPages = totalPages;
      
      if (currentPage < totalPages) {
        data.pageSuivante = currentPage + 1;
        data.estDernierePage = false;
      } else {
        data.pageSuivante = null;
        data.estDernierePage = true;
      }
    } catch (err) {
      console.error("Erreur lors du calcul du nombre total de pages:", err);
      // En cas d'erreur, on suppose que c'est la dernière page
      data.pageCourante = parseInt(page, 10);
      data.totalPages = data.pageCourante;
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