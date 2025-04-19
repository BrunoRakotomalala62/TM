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
    
    // Déterminer le nombre total de pages lors de la première recherche
    try {
      const currentPage = parseInt(page, 10);
      
      // Si c'est la page 1, on va déterminer le nombre total de pages
      if (currentPage === 1) {
        // Fonction pour vérifier si une page existe
        async function checkPageExists(pageNum) {
          const checkResponse = await fetch(`https://test-api-milay-vercel.vercel.app/api/ohab/recherche?ohabolana=${encodeURIComponent(terme)}&page=${pageNum}`);
          const checkData = await checkResponse.json();
          return checkData.resultats && checkData.resultats.length > 0;
        }
        
        // Recherche binaire pour trouver rapidement la dernière page
        // On commence par estimer qu'il y a au maximum 30 pages
        let low = 1;
        let high = 30;
        let lastConfirmedPage = 1;
        
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          
          if (await checkPageExists(mid)) {
            lastConfirmedPage = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        
        // On a maintenant le nombre total de pages
        const totalPages = lastConfirmedPage;
      
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
      } else {
        // Si ce n'est pas la page 1, on utilise les informations de pagination existantes
        // ou on obtient le nombre total de pages depuis le stockage
        data.pageCourante = currentPage;
        
        // Vérifier si cette page existe vraiment
        if (data.resultats && data.resultats.length > 0) {
          // On utilise le nombre total que nous avons déjà calculé lors de la première requête
          // Ce nombre est aussi transmis dans les données de la réponse
          data.estDernierePage = (currentPage === data.totalPages);
          data.pageSuivante = data.estDernierePage ? null : currentPage + 1;
        } else {
          // Si cette page n'existe pas, on redirige vers la dernière page connue
          data.pageCourante = 1; // Retour à la page 1 par défaut
          data.estDernierePage = true;
          data.pageSuivante = null;
        }
      }
    } catch (err) {
      console.error("Erreur lors du calcul du nombre total de pages:", err);
      // En cas d'erreur, on suppose que c'est la dernière page connue
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