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
import { parseObjectId, PRIVATE_BUCKET, PUBLIC_BUCKET, streamImage } from "../utils/media.js";

const router = express.Router();

// SameSite=strict means the frontend and API must share a site (e.g. www.example.org and api.example.org).
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
};

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

    res.cookie("admin_token", token, { ...cookieOptions, maxAge: 2 * 60 * 60 * 1000 });

    return res.json({ message: "Login successful." });
  })
);

router.get("/admissions", requireAdmin, asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not configured yet. Please set MONGODB_URI." });
  }

  const [admissions, admin] = await Promise.all([
    Admission.find()
      .sort({ createdAt: -1 })
      .select("firstName lastName phone classApplied status createdAt")
      .limit(100)
      .lean(),
    AdminUser.findById(req.admin.sub).select("admissionsSeenAt").lean()
  ]);

  return res.json({ admissions, seenAt: admin?.admissionsSeenAt || null });
}));

// Shows how the server sees the logged-in admin's connection, to pick the right TRUST_PROXY value.
router.get("/network-check", requireAdmin, (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"] || "";
  res.json({
    seenAs: req.ip,
    trustProxy: req.app.get("trust proxy"),
    forwardedFor,
    proxiesInChain: forwardedFor ? forwardedFor.split(",").length : 0
  });
});

// Restores the admin panel after a page refresh while the login cookie is still valid.
router.get("/session", requireAdmin, (req, res) => {
  res.json({ email: req.admin.email });
});

router.post("/admissions/seen", requireAdmin, asyncHandler(async (req, res) => {
  const seenAt = new Date();
  await AdminUser.updateOne({ _id: req.admin.sub }, { admissionsSeenAt: seenAt });
  return res.json({ seenAt });
}));

router.patch(
  "/admissions/:id",
  requireAdmin,
  [body("status").isIn(Admission.schema.path("status").enumValues).withMessage("Choose a valid status.")],
  handleValidation,
  asyncHandler(async (req, res) => {
    const id = parseObjectId(req.params.id);
    const admission = id
      ? await Admission.findByIdAndUpdate(id, { status: req.body.status }, { new: true, runValidators: true })
        .select("firstName lastName phone classApplied status createdAt")
        .lean()
      : null;
    if (!admission) return res.status(404).json({ message: "Enquiry not found." });
    return res.json({ admission });
  })
);

router.get("/admissions/:id/photo", requireAdmin, asyncHandler(async (req, res) => {
  const id = parseObjectId(req.params.id);
  if (!id || mongoose.connection.readyState !== 1) {
    return res.status(404).json({ message: "Photo not found." });
  }

  const admission = await Admission.findById(id).select("photo").lean();
  if (admission?.photo?.fileId) {
    return streamImage(PRIVATE_BUCKET, admission.photo.fileId, res, "private, no-store");
  }

  // Admissions created before photos moved to the private bucket.
  const legacyId = parseObjectId(admission?.photo?.fileName?.split("/").pop());
  if (legacyId) {
    return streamImage(PUBLIC_BUCKET, legacyId, res, "private, no-store");
  }

  return res.status(404).json({ message: "Photo not found." });
}));

router.post("/logout", requireAdmin, (req, res) => {
  res.clearCookie("admin_token", cookieOptions);
  res.json({ message: "Logged out." });
});

export default router;
