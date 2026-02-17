import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRAGResponse = async (query: string, context: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are an AI assistant in a RAG pipeline simulation.
      
      Context retrieved from Vector DB:
      ${context}
      
      User Query: ${query}
      
      Please provide a concise answer (max 2 sentences) based strictly on the context.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating response from Gemini. Check console.";
  }
};