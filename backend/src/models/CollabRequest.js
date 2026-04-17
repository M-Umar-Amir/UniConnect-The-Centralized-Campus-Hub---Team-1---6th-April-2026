import mongoose from "mongoose";

export const COLLAB_REQUEST_STATUS = ["pending", "accepted", "declined"];

const collabRequestSchema = new mongoose.Schema(
  {
    startup: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true, index: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, default: "", trim: true, maxlength: 1000 },
    status: { type: String, enum: COLLAB_REQUEST_STATUS, default: "pending", index: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

collabRequestSchema.index({ startup: 1, applicant: 1 }, { unique: true });

export const CollabRequest = mongoose.model("CollabRequest", collabRequestSchema, "collab_requests");
