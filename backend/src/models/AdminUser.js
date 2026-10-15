import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin", required: true },
    active: { type: Boolean, default: true },
    // When this admin last dismissed the "new admissions" popup; only newer enquiries trigger it again.
    admissionsSeenAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("AdminUser", adminUserSchema);
