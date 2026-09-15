import bcrypt from "bcryptjs";
import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { requireAdmin } from "../middleware/auth.js";
import Admission from "../models/Admission.js";
import AdminUser from "../models/AdminUser.js";
import { handleValidation } from "../utils/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  message: { message: "Too many login attempts. Please try again later." },
  standardHeaders: "draft-7",
  legacyHeaders: false
});

router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Enter a valid email."),
    body("password").isLength({ min: 8, max: 128 }).withMessage("Password must be at least 8 characters.")
  ],
  handleValidation,
  asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1 || !process.env.JWT_SECRET) {
      return res.status(503).json({ message: "Administrator access is not configured yet." });
    }

    const email = req.body.email.toLowerCase();
    const admin = await AdminUser.findOne({ email }).select("+passwordHash");
    const passwordMatches = admin ? await bcrypt.compare(req.body.password, admin.passwordHash) : false;

    if (!admin || !admin.active || !passwordMatches) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const token = jwt.sign({ sub: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000
    });

    return res.json({ message: "Login successful." });
  })
);

router.get("/admissions", requireAdmin, asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not configured yet. Please set MONGODB_URI." });
  }

  const admissions = await Admission.find()
    .sort({ createdAt: -1 })
    .select("firstName lastName phone classApplied status createdAt")
    .limit(100)
    .lean();

  return res.json({ admissions });
}));

router.post("/logout", requireAdmin, (req, res) => {
  res.clearCookie("admin_token");
  res.json({ message: "Logged out." });
});

export default router;
