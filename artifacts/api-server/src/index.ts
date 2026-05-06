import app from "./app.js";

const port = process.env.PORT || 3000;

// Only start the server when running locally (not on Vercel)
if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
