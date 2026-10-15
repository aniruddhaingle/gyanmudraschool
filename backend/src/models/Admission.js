import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    fatherName: { type: String, required: true, trim: true, maxlength: 120 },
    caste: { type: String, enum: ["", "General", "OBC", "SC", "ST"], default: "" },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    address: { type: String, required: true, trim: true, maxlength: 600 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    classApplied: { type: String, required: true, trim: true, maxlength: 40 },
    photo: {
      originalName: String,
      // Private GridFS file id; older records only have a public fileName URL.
      fileId: mongoose.Schema.Types.ObjectId,
      fileName: String,
      mimeType: String,
      size: Number
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Admitted", "Rejected"],
      default: "New"
    }
  },
  { timestamps: true }
);

admissionSchema.index({ phone: 1, createdAt: -1 });

export default mongoose.model("Admission", admissionSchema);
