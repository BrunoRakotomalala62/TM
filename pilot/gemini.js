
// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

async function main() {
  // Vérifier si la clé API est disponible
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Erreur: La clé API Gemini n'est pas définie. Veuillez définir la variable d'environnement GEMINI_API_KEY.");
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });
    
    const config = {
      responseMimeType: 'text/plain',
    };
    
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const userInput = `INSERT_INPUT_HERE`;
    
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1000,
    };
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      generationConfig,
    });
    
    const response = result.response;
    console.log(response.text());
  } catch (error) {
    console.error("Erreur lors de la communication avec l'API Gemini:", error.message);
  }
}

main();
