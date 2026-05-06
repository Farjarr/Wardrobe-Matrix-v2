import { Router } from "express";
import { healthRouter } from "./health.js";
import { outfitRouter } from "./outfit.js";

const router = Router();

// Health check route
router.use("/health", healthRouter);

// Outfit management route
router.use("/outfit", outfitRouter);

export { healthRouter, outfitRouter };
export default router;
