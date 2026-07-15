import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to generate custom Umrah advertisement copy/scripts
app.post("/api/generate-copy", async (req, res) => {
  try {
    const { agencyName, features, tone, mainTheme } = req.body;
    
    const client = getGeminiClient();
    
    const prompt = `
      صمم سيناريو إعلاني ترويجي مبتكر لرحلة عمرة مميزة لشركة سياحة اسمها "${agencyName || 'هاي لايتس ترافيل'}".
      الموضوع الأساسي للرحلة: "${mainTheme || 'رحلة روحانية متكاملة واقتصادية'}".
      المميزات المتاحة: "${features || 'طيران مريح، إشراف ديني، صحبة طيبة، فنادق قريبة'}".
      النبرة المطلوبة: "${tone || 'ودودة ومقنعة باللهجة العامية المصرية'}".
      
      المطلوب توليد المخرجات بالتنسيق التالي في صيغة JSON:
      {
        "slogan": "شعار مبتكر وجذاب للرحلة بالعامية المصرية",
        "scene1": "نص المشهد الأول (الترحيب والتجربة الشخصية بالعامية المصرية)",
        "scene2": "نص المشهد الثاني (عن جودة الطيران والرحلة بالعامية المصرية)",
        "scene3": "نص المشهد الثالث (عن الإشراف الديني والصحبة وطريقة التواصل بالعامية المصرية)"
      }
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogan: { type: Type.STRING, description: "A catchy Egyptian slogan for the Umrah trip." },
            scene1: { type: Type.STRING, description: "Egyptian colloquial Arabic text for scene 1." },
            scene2: { type: Type.STRING, description: "Egyptian colloquial Arabic text for scene 2." },
            scene3: { type: Type.STRING, description: "Egyptian colloquial Arabic text for scene 3." },
          },
          required: ["slogan", "scene1", "scene2", "scene3"],
        },
      },
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Gemini copy generation error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "فشل توليد النص الإعلاني الذكي، يرجى التحقق من مفتاح الـ API" 
    });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
