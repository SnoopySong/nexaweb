import { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/serverless";

let app: any = null;

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!app) {
    app = await createApp();
  }

  return new Promise<void>((resolve) => {
    app(req, res);
    res.on("finish", () => resolve());
    
    setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).end("Timeout");
      }
      resolve();
    }, 29000);
  });
};
