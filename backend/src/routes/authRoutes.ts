import { Router } from "express";
import { register, login, protectedRoute } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/protected", protectedRoute);

export default router;
