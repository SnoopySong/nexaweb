import express from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/static";
import { createServer } from "http";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let routesRegistered = false;

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (!routesRegistered) {
    await registerRoutes(httpServer, app);
    await serveStatic(app);
    routesRegistered = true;
  }

  app(req, res);
};

export default handler;
