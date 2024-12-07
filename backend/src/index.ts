import express, { Application, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { PORT } from "./config";

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Trasy
app.use("/auth", authRoutes);

// Start serwera
app.listen(PORT, () =>
{
    console.log(`Serwer działa na porcie ${PORT}`);
});

