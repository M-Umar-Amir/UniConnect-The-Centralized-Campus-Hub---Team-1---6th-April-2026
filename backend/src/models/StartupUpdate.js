import mongoose from "mongoose";

const startupUpdateSchema = new mongoose.Schema(
  {
    startup: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 1500 },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    media: { type: [String], default: [] }
  },
  { timestamps: true }
);

startupUpdateSchema.index({ startup: 1, createdAt: -1 });

export const StartupUpdate = mongoose.model("StartupUpdate", startupUpdateSchema, "startup_updates");
