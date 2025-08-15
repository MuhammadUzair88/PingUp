// db.js
import mongoose from "mongoose";

let isConnected = false;
export async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
  isConnected = true;
  console.log("MongoDB connected");
}
