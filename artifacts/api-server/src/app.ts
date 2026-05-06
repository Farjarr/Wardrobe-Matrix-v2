import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/index.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", router);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Wardrobe Matrix API Server", status: "running" });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
