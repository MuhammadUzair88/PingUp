import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { inngest, functions } from "./config/index.js";
import { serve } from 'inngest/express';
import { connectDB } from './DB.js';

await connectDB()

const app = express();

app.use(express.json());
app.use(cors());




app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use("/api/inngest", serve({ client: inngest, functions }));

const PORT = process.env.PORT || 4000;

// Connecting mongodb


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
