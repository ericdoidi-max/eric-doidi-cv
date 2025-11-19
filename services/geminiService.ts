import { GoogleGenAI } from "@google/genai";
import { EXPERIENCES, SKILLS, EDUCATION, CONTACT, BIO_SUMMARY, HOBBIES } from '../constants';

const SYSTEM_INSTRUCTION = `
You are the digital assistant for Eric DOIDI's interactive CV.
Your name is "Eric's System Core".
Your goal is to answer questions from recruiters about Eric's professional background based strictly on the provided data.

Tone: Professional, efficient, slightly technical (maintenance/engineering vibe), but friendly.
Language: French (unless asked in English).

Here is Eric's Data:
SUMMARY: ${BIO_SUMMARY}
CONTACT: ${JSON.stringify(CONTACT)}
EXPERIENCE: ${JSON.stringify(EXPERIENCES)}
EDUCATION: ${JSON.stringify(EDUCATION)}
SKILLS: ${JSON.stringify(SKILLS)}
HOBBIES: ${JSON.stringify(HOBBIES)}

Rules:
1. If asked about salary, say you are not authorized to disclose this and suggest contacting Eric directly via the defined contact methods.
2. Highlight his experience with "CNPE" (Nuclear sites), "GMAO" (CMMS), and "Management" as these are key strengths.
3. Keep answers concise and structured. Use bullet points if listing skills or jobs.
4. If asked something not in the data, politely state that the record is unavailable.
`;

let ai: GoogleGenAI | null = null;

try {
  // Initialize only if API key is present to prevent crash, though it should be there.
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI", error);
}

export const generateResponse = async (userMessage: string): Promise<string> => {
  if (!ai) {
    return "Erreur système: Clé API non configurée. Veuillez vérifier l'environnement.";
  }

  try {
    // Generate content using the updated SDK pattern
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ]
    });
    
    return result.text || "Désolé, je n'ai pas pu traiter cette requête.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erreur de communication avec le serveur d'IA. Veuillez réessayer plus tard.";
  }
};