import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db';
connectDB();

import express from 'express';
const app = express();

app.use(express.json());


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});