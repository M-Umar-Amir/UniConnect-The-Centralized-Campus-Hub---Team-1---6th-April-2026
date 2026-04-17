import mongoose from "mongoose";

export const REGISTRATION_STATUS = ["registered", "waitlisted", "cancelled"];

const registrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: REGISTRATION_STATUS, default: "registered", index: true },
    waitlistPosition: { type: Number, default: null },
    segment: { type: String, default: null, trim: true, maxlength: 120 },
    registeredAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

registrationSchema.index({ event: 1, user: 1 }, { unique: true });

export const Registration = mongoose.model("Registration", registrationSchema);
