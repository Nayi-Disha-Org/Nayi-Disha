import express from "express";
import { register, login, getProfile, updateProfile } from "../controllers/authController.js";

const router = express.Router();

// Authentication Routes
router.post("/register", register);
router.post("/login", login);

// Profile & Settings Routes
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);

export default router;