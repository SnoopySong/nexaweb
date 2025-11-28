import { VercelRequest, VercelResponse } from "@vercel/node";

// Import the built server module directly
const module = await import("../dist/index.cjs");
const app = module.default || module;

export default async (req: VercelRequest, res: VercelResponse) => {
  return new Promise<void>((resolve) => {
    app(req, res);
    res.on("finish", resolve);
  });
};
