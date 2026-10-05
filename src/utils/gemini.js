const { GoogleGenAI } = require('@google/genai');

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in the .env file');
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function generateContent(prompt) {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text || '';
}

module.exports = { generateContent };
