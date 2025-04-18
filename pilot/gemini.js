
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require('multer');
const mime = require("mime-types");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY environment variable is not set');
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let chatSession = null;

async function handleChat(message, files = []) {
  try {
    if (!chatSession) {
      chatSession = model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });
    }

    let result;
    if (files && files.length > 0) {
      const parts = [];
      parts.push({ text: message || "Décrivez cette image en détail" });

      for (const file of files) {
        if (file.mimetype.startsWith('image/')) {
            console.log("Image reçue:", file.originalname);
          parts.push({
            inlineData: {
              data: file.buffer.toString('base64'),
              mimeType: file.mimetype
            }
          });
        }
      }

      result = await model.generateContent(parts);
    } else {
      result = await chatSession.sendMessage(message);
    }

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in handleChat:', error);
    throw error;
  }
}

const router = express.Router();

router.post('/chat', upload.array('files'), async (req, res) => {
  try {
    const message = req.body.message;
    const files = req.files;

    const response = await handleChat(message, files);
    res.send(response);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: "Une erreur est survenue", details: error.message });
  }
});

router.post('/reset', (req, res) => {
  try {
    chatSession = null;
    res.json({ success: true, message: "Conversation réinitialisée avec succès" });
  } catch (error) {
    console.error('Error resetting conversation:', error);
    res.status(500).json({ error: "Une erreur est survenue lors de la réinitialisation" });
  }
});

module.exports = {
  router,
  handleChat
};
