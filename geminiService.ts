
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "./types";

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
    return response.text || "I'm having a slight glitch in my neural network. Please try again.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "The uplink is currently unstable. Please try again shortly.";
  }
};

export const getAIRecommendations = async (currentProduct: Product, allProducts: Product[], wishlistIds: string[]) => {
  try {
    const wishlistNames = allProducts
      .filter(p => wishlistIds.includes(p.id))
      .map(p => p.name)
      .join(', ');

    const catalogInfo = allProducts
      .map(p => ({ id: p.id, name: p.name, category: p.category }))
      .filter(p => p.id !== currentProduct.id);

    const prompt = `Current Product: ${currentProduct.name} (${currentProduct.category}).
User Wishlist: ${wishlistNames || 'Empty'}.
Available Catalog: ${JSON.stringify(catalogInfo)}.

Identify the 3 most relevant products that complement the current product or match the user's style based on their wishlist.
Return ONLY a JSON array of IDs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a personalized recommendation engine for PRIMERSTORE. Analyze user patterns and return a JSON array of strings containing product IDs from the provided catalog.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const recommendedIds = JSON.parse(response.text || '[]');
    return allProducts.filter(p => recommendedIds.includes(p.id));
  } catch (error) {
    console.error("Recommendation Error:", error);
    return [];
  }
};
