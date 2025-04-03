import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const app = express();
const apiKey = process.env.OPENAI_API_KEY;

// Serve static files
app.use(express.static(join(__dirname, "dist")));

// API route for token generation
app.get("/token", async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ 
        error: { 
          message: "OpenAI API key not configured", 
          type: "server_error" 
        } 
      });
    }
    
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "verse",
        }),
      },
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ 
      error: { 
        message: error.message || "Failed to generate token", 
        type: "server_error" 
      } 
    });
  }
});

// Serve index.html for all other routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

// Start the server if not in production (Vercel handles this in production)
if (!isProduction) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export the Express app for Vercel
export default app;
