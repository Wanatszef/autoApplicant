import express, { Application, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/authRoutes";
import { PORT } from "./config";

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Trasy
app.use("/auth", router);

// Start serwera
app.listen(PORT, () =>
{
    console.log(`Serwer działa na porcie ${PORT}`);
});

