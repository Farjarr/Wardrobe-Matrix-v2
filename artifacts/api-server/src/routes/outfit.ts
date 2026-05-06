import { Router, Request, Response } from "express";

const outfitRouter = Router();

outfitRouter.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Outfit routes", outfits: [] });
});

export { outfitRouter };
