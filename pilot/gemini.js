const express = require('express');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/genai");
const fs = require("node:fs");
const multer = require('multer');
const mime = require("mime-types");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
  },
});

const imageModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

let chatSession = null;

async function handleChat(message, files = []) {
  try {
    if (!chatSession) {
      chatSession = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 2048,
        },
      });
    }

    let result;
    if (files && files.length > 0) {
      const parts = [];
      parts.push({ text: message || "Analysez ces images" });

      for (const file of files) {
        if (file.mimetype.startsWith('image/')) {
          parts.push({
            inlineData: {
              data: file.buffer.toString('base64'),
              mimeType: file.mimetype
            }
          });
        }
      }

      result = await imageModel.generateContent(parts);
    } else {
      result = await chatSession.sendMessage(message);
    }

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in handleChat:', error);
    return "Désolé, je ne peux pas traiter votre demande pour le moment.";
  }
}

const router = express.Router();

router.post('/chat', upload.array('files'), async (req, res) => {
  try {
    const message = req.body.message;
    const files = req.files;

    const response = await handleChat(message, files);
    res.json({ response });

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