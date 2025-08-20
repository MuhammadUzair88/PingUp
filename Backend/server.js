import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { inngest, functions } from "./config/index.js";
import { serve } from "inngest/express";
import { connectDB } from "./DB.js";
import { clerkMiddleware } from "@clerk/express";

import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/PostRoutes.js";
import storyRouter from "./routes/StoryRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

// ✅ Clerk middleware (make sure CLERK_SECRET_KEY is set in Vercel env vars)
app.use(clerkMiddleware());

// Routes
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Inngest endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// MongoDB connection
const startServer = async () => {
  try {
    await connectDB(); // ✅ connect only once
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB", error);
    process.exit(1);
  }
};

startServer();
