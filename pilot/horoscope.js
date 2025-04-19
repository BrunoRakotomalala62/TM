
const express = require('express');
const router = express.Router();

async function getHoroscope(signe) {
    try {
        const response = await fetch(`https://test-api-milay-vercel.vercel.app/horoscope/rechercher?signe=${signe}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'horoscope:', error);
        throw error;
    }
}

router.get('/rechercher', async (req, res) => {
    try {
        const { signe } = req.query;
        const horoscope = await getHoroscope(signe);
        res.json(horoscope);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'horoscope' });
    }
});

module.exports = router;
