import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db';
connectDB();

import express from 'express';
import cookieParser from 'cookie-parser';
import { AuthRouter } from './routes/user.route';
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/auth", AuthRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});