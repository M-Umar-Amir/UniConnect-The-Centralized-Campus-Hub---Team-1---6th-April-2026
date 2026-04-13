import mongoose from "mongoose";

const pendingEmailChangeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    newEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

pendingEmailChangeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingEmailChange = mongoose.model("PendingEmailChange", pendingEmailChangeSchema);
