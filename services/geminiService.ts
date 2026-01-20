
import { GoogleGenAI } from "@google/genai";

// Strictly follow @google/genai coding guidelines for client initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistance = async (message: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: You are a futuristic AI assistant for PRIMERSTORE. Help the customer with their questions. Store context: ${context}\n\nUser Message: ${message}`,
      config: {
        systemInstruction: "You are Zenith, the AI concierge of PRIMERSTORE, a high-tech electronics store. Be helpful, concise, and professional. Mention products from our catalog if relevant.",
        temperature: 0.7,
      }
    });
    // Correctly accessing the text property from GenerateContentResponse.
    return response.text || "I'm having a slight glitch in my neural network. Please try again.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "The uplink is currently unstable. Please try again shortly.";
  }
};
