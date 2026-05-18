import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Gemini API setup (lazy initialization is better)
  const getAi = () => {
    if (!process.env.GEMINI_API_KEY) return null;
    return new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route for Gemini
  app.post("/api/generate", async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    
    const ai = getAi();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "Tu es l'assistant virtuel d'Eric Doidi. Réponds aux questions sur son parcours de manière professionnelle.",
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    // Dynamic import to avoid crash in production when vite is missing
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
