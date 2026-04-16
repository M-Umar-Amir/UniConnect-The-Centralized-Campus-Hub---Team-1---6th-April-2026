import mongoose from "mongoose";

const eventHighlightSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    caption: { type: String, required: true, trim: true, maxlength: 300 },
    media: { type: [String], default: [] },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

eventHighlightSchema.index({ event: 1, createdAt: -1 });

export const EventHighlight = mongoose.model("EventHighlight", eventHighlightSchema, "event_highlights");
