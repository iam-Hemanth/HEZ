import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

const TMDB_FALLBACK_KEY = "422330314793cfddb004ce51a89d7a2a"; // Isolated to backend

async function startServer() {
  const app = express();
  const PORT = 3000;

  // TMDB API Proxy Route
  // Protects the API key from being exposed to the client bundle
  app.get("/api/tmdb/*", async (req, res) => {
    try {
      const endpoint = req.params[0];
      const tmdbKey = process.env.VITE_TMDB_KEY || process.env.TMDB_KEY || TMDB_FALLBACK_KEY;
      
      const queryParams = new URLSearchParams(req.query as any);
      queryParams.append('api_key', tmdbKey);
      
      const tmdbUrl = `https://api.themoviedb.org/3/${endpoint}?${queryParams.toString()}`;
      
      const tmdbRes = await fetch(tmdbUrl);
      const data = await tmdbRes.json();
      
      res.status(tmdbRes.status).json(data);
    } catch (error) {
      console.error("TMDB Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch from TMDB" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
