import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "follow",
        "event",
        "startup",
        "announcement",
        "event_reg",
        "startup_match"
      ],
      required: true,
      index: true
    },
    text: { type: String, required: true, trim: true, maxlength: 240 },
    targetUrl: { type: String, required: true },
    referenceThumbnail: { type: String, default: "" },
    isRead: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
