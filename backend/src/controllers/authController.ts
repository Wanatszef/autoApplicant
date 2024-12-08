import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../models/userModel";
import { JWT_SECRET } from "../config";

export const register = async (req: Request, res: Response): Promise<void> =>
{
    const { email, password } = req.body;

    if (!email || !password)
    {
        res.status(400).json({ message: "Email i hasło są wymagane." });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });

    res.status(201).json({ message: "Rejestracja zakończona sukcesem." });
};

export const login = async (req: Request, res: Response): Promise<void> =>
{
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user)
    {
        res.status(404).json({ message: "Nie znaleziono użytkownika." });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
    {
        res.status(401).json({ message: "Nieprawidłowe hasło." });
        return;
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token });
};

export const protectedRoute = (req: Request, res: Response): Promise<void> =>
{
    const authHeader = req.headers.authorization;

    if (!authHeader)
    {
        res.status(401).json({ message: "Brak tokenu." });
        return Promise.resolve();
    }

    const token = authHeader.split(" ")[1];

    try
    {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: "Dostęp przyznany.", user: decoded });
    }
    catch (error)
    {
        res.status(403).json({ message: "Nieprawidłowy token." });
    }

    return Promise.resolve();
};
