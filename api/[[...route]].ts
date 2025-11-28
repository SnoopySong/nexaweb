import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/static";
import { createServer } from "http";

let app: express.Express | null = null;

async function initializeApp() {
  if (app) return app;

  app = express();
  const httpServer = createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  await registerRoutes(httpServer, app);
  await serveStatic(app);

  return app;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const expressApp = await initializeApp();

    return new Promise<void>((resolve) => {
      expressApp(req as any, res as any);
      
      res.on("finish", () => {
        resolve();
      });

      setTimeout(() => {
        if (!res.headersSent) {
          res.status(504).json({ error: "Gateway Timeout" });
        }
        resolve();
      }, 30000);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: String(error) });
  }
};
