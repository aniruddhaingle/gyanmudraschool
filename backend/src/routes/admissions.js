import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import mongoose from "mongoose";
import Admission from "../models/Admission.js";
import { isAllowedImage, uploadStudentPhoto } from "../middleware/upload.js";
import { storeImage } from "../utils/media.js";
import { handleValidation } from "../utils/validate.js";

const router = express.Router();

const admissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  message: { message: "Too many admission attempts. Please try again later." },
  standardHeaders: "draft-7",
  legacyHeaders: false
});

const admissionRules = [
  body("firstName").trim().isLength({ min: 2, max: 80 }).withMessage("First name must be 2-80 characters."),
  body("lastName").trim().isLength({ min: 2, max: 80 }).withMessage("Last name must be 2-80 characters."),
  body("fatherName").trim().isLength({ min: 2, max: 120 }).withMessage("Father's name must be 2-120 characters."),
  body("gender").isIn(["Male", "Female", "Other"]).withMessage("Please select a valid gender."),
  body("caste").optional({ values: "falsy" }).isIn(["General", "OBC", "SC", "ST"]).withMessage("Please select a valid caste category."),
  body("address").trim().isLength({ min: 8, max: 600 }).withMessage("Address must be 8-600 characters."),
  body("phone").trim().matches(/^[0-9+\-\s]{8,15}$/).withMessage("Please enter a valid phone number."),
  body("classApplied").trim().isLength({ min: 1, max: 40 }).withMessage("Class applied for is required.")
];

router.post("/", admissionLimiter, (req, res, next) => {
  uploadStudentPhoto(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    return next();
  });
}, admissionRules, handleValidation, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database is not configured yet. Please set MONGODB_URI." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Student photo is required." });
    }

    if (!isAllowedImage(req.file)) {
      return res.status(400).json({ message: "The uploaded file is not a valid JPG, PNG, or WEBP image." });
    }

    const fileName = await storeImage(req.file);
    const admission = await Admission.create({
      ...req.body,
      photo: {
        originalName: req.file.originalname,
        fileName,
        mimeType: req.file.mimetype,
        size: req.file.size
      }
    });

    return res.status(201).json({ id: admission._id, message: "Admission enquiry received." });
  } catch (error) {
    return next(error);
  }
});

export default router;
