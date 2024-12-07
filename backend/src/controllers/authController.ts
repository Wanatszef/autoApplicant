import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../models/userModel";
import { JWT_SECRET } from "../config";

// Rejestracja użytkownika
export const register = async (req: Request, res: Response) =>
{
    const { email, password } = req.body;

    if (!email || !password)
    {
        return res.status(400).json({ message: "Email i hasło są wymagane." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });

    return res.status(201).json({ message: "Rejestracja zakończona sukcesem." });
};

// Logowanie użytkownika
export const login = async (req: Request, res: Response) =>
{
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user)
    {
        return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
    {
        return res.status(401).json({ message: "Nieprawidłowe hasło." });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ token });
};

// Ochroniona trasa
export const protectedRoute = (req: Request, res: Response) =>
{
    const authHeader = req.headers.authorization;

    if (!authHeader)
    {
        return res.status(401).json({ message: "Brak tokenu." });
    }

    const token = authHeader.split(" ")[1];

    try
    {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.status(200).json({ message: "Dostęp przyznany.", user: decoded });
    }
    catch (error)
    {
        return res.status(403).json({ message: "Nieprawidłowy token." });
    }
};
