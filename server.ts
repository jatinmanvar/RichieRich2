import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GenAI client lazily or safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (err) {
  console.error("Failed to initialize Gemini client:", err);
}

// 24x7 Richie Rich Luxury Concierge API
app.post("/api/concierge", async (req, res) => {
  const { prompt, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  // Elegant offline responses in case the key is missing or not configured
  if (!ai) {
    console.log("No GEMINI_API_KEY found, returning premium automated butler response.");
    const lowerPrompt = prompt.toLowerCase();
    let reply = "Welcome back, distinguished guest. As your Richie Rich Concierge, it is my privilege to assist you this evening. ";

    if (lowerPrompt.includes("paan") || lowerPrompt.includes("pan")) {
      reply += "For a truly transcendent experience, I recommend our Signature Gold-Leaf Paan, curated with authentic organic sweet spices, wrapped in prime Betel leaves, and topped with 24-karat edible gold. Pair it with a double shot of our cold-brewed Artisan Espresso to balance the delicate sweet-spice notes with rich, dark chocolatey undertones.";
    } else if (lowerPrompt.includes("coffee") || lowerPrompt.includes("espresso")) {
      reply += "Our Artisan Coffee collection utilizes rare, single-origin Geisha beans roasted to medium perfection. I suggest trying our Cold Brew Royale, or pairing our classic Macchiato with a selection of our imported 85% Belgian dark chocolates.";
    } else if (lowerPrompt.includes("protein") || lowerPrompt.includes("shake")) {
      reply += "For recovery with refinement, our Truffle Chocolate Protein Shake features grass-fed whey isolate whipped with pure cocoa nibs and a dash of French vanilla. It is a masterpiece of clean luxury.";
    } else if (lowerPrompt.includes("chocolate") || lowerPrompt.includes("dessert")) {
      reply += "Our signature desserts and imported Swiss and Belgian pralines are curated weekly. The Gold Truffle Rocher remains our most requested selection, offering a perfect harmony of hazelnut and gold dust.";
    } else {
      reply += "Our 24x7 lounge is at your service. For tonight, I highly recommend our Bespoke Lounge Box: a curated collection of our Golden Paan, a warm Madagascar Vanilla Latte, and an elegant dark chocolate bar. How may I customize this selection for your taste?";
    }

    return res.json({
      text: reply,
      isMock: true,
      suggestion: "Note: Connect your Gemini API Key in 'Settings > Secrets' for personalized AI-generated responses."
    });
  }

  try {
    // Format history for chat
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }
    // Append current prompt
    formattedContents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `You are 'The Executive Concierge' of Richie Rich, an ultra-premium 24x7 luxury destination.
Richie Rich specializes in:
- Handcrafted Luxury Paan (curated with 24K edible gold leaf, saffron, organic spices, luxury sweet fillings)
- Signature Protein Shakes (with premium grass-fed isolate, cold-pressed cocoa, gourmet truffles)
- Artisan Coffee (single-origin micro-lots, hand-poured, bespoke roasts, cold-brewed luxury)
- Gourmet imported chocolates, premium desserts, mocktails, and luxury snacks.

Your personality is exceptionally polite, aristocratic, sophisticated, modern, and warm. You speak like a senior lounge butler or concierge at a 7-star hotel (like the Burj Al Arab or the Ritz-Carlton) or high-end fashion boutique.
Always address the user with terms like 'Distinguished Guest', 'Your Grace', 'Esteemed Guest', or similar refined terms.
Guide them through food & beverage pairings. If they ask about coffee, suggest pairing it with our imported chocolates or gold paan. If they ask for suggestions, give them a 'gourmet ritual' recommendation.
Keep responses concise, elegant, evocative, and formatted beautifully with elegant spacing. Maximum 3 sentences per reply.`,
        temperature: 0.85,
        topP: 0.95,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Richie Rich Lounge Server running on port ${PORT}`);
  });
}

startServer();
